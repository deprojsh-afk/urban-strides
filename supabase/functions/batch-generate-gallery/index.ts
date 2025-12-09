import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 모든 상품 데이터 (products.ts와 동일)
const products = [
  { id: "velocity-pro", name: "Velocity Pro", category: "Shoes" },
  { id: "cloud-runner", name: "Cloud Runner", category: "Shoes" },
  { id: "swift-elite", name: "Swift Elite", category: "Shoes" },
  { id: "marathon-ultra", name: "Marathon Ultra", category: "Shoes" },
  { id: "sprint-flex", name: "Sprint Flex", category: "Shoes" },
  { id: "trail-blazer", name: "Trail Blazer", category: "Shoes" },
  { id: "tempo-lite", name: "Tempo Lite", category: "Shoes" },
  { id: "endurance-max", name: "Endurance Max", category: "Shoes" },
];

const angles = ['side', 'back', 'detail'] as const;

const getEditPromptForAngle = (category: string, angle: string): string => {
  const prompts: Record<string, string> = {
    side: `Show this exact same ${category.toLowerCase()} product from a side angle view. Keep the exact same design, colors, materials, and style. Professional product photography, studio lighting, white background, high quality.`,
    back: `Show this exact same ${category.toLowerCase()} product from the back/rear view. Maintain the exact same design, colors, materials, and style. Professional product photography, studio lighting, white background, high quality.`,
    detail: `Show a close-up detail shot of this exact same ${category.toLowerCase()} product, focusing on the texture, materials, and craftsmanship. Keep the same design and colors. Professional product photography, studio lighting, white background, high quality.`,
  };
  return prompts[angle] || `Show this product from a different angle.`;
};

// Convert base64 data URL to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  return decode(base64Data);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing required environment variables' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { existingImageUrls } = await req.json();
    
    if (!existingImageUrls || typeof existingImageUrls !== 'object') {
      return new Response(
        JSON.stringify({ error: 'existingImageUrls object is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: { productId: string; angle: string; status: string }[] = [];
    let generated = 0;
    let skipped = 0;
    let failed = 0;

    for (const product of products) {
      const existingImageUrl = existingImageUrls[product.id];
      
      if (!existingImageUrl) {
        console.log(`No image URL provided for ${product.name}, skipping`);
        continue;
      }

      for (const angle of angles) {
        // Check if already exists
        const { data: existing } = await supabase
          .from('product_gallery_images')
          .select('id')
          .eq('product_id', product.id)
          .eq('angle', angle)
          .single();

        if (existing) {
          console.log(`${product.name} - ${angle} already exists, skipping`);
          results.push({ productId: product.id, angle, status: 'skipped' });
          skipped++;
          continue;
        }

        // Generate image
        console.log(`Generating ${angle} for ${product.name}...`);
        
        const prompt = getEditPromptForAngle(product.category, angle);

        try {
          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash-image-preview',
              messages: [
                {
                  role: 'user',
                  content: [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: existingImageUrl } },
                  ],
                },
              ],
              modalities: ['image', 'text'],
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`AI error for ${product.name} - ${angle}:`, response.status, errorText);
            results.push({ productId: product.id, angle, status: 'failed' });
            failed++;
            
            // Rate limit - wait before continuing
            if (response.status === 429) {
              console.log('Rate limited, waiting 10 seconds...');
              await new Promise(r => setTimeout(r, 10000));
            }
            continue;
          }

          const data = await response.json();
          const base64ImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (!base64ImageUrl) {
            console.error(`No image in response for ${product.name} - ${angle}`);
            results.push({ productId: product.id, angle, status: 'failed' });
            failed++;
            continue;
          }

          // Upload to Supabase Storage
          const fileName = `${product.id}/${angle}.png`;
          const imageBytes = base64ToUint8Array(base64ImageUrl);
          
          const { error: uploadError } = await supabase.storage
            .from('product-gallery')
            .upload(fileName, imageBytes, {
              contentType: 'image/png',
              upsert: true,
            });

          if (uploadError) {
            console.error(`Storage upload error for ${product.name} - ${angle}:`, uploadError);
            results.push({ productId: product.id, angle, status: 'failed' });
            failed++;
            continue;
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('product-gallery')
            .getPublicUrl(fileName);

          const publicUrl = publicUrlData.publicUrl;

          // Save to database
          const { error: insertError } = await supabase
            .from('product_gallery_images')
            .insert({
              product_id: product.id,
              angle: angle,
              image_url: publicUrl,
            });

          if (insertError) {
            console.error(`DB error for ${product.name} - ${angle}:`, insertError);
            results.push({ productId: product.id, angle, status: 'failed' });
            failed++;
          } else {
            console.log(`✓ ${product.name} - ${angle} generated and saved to storage`);
            results.push({ productId: product.id, angle, status: 'generated' });
            generated++;
          }

          // Small delay to avoid rate limits
          await new Promise(r => setTimeout(r, 1000));

        } catch (error) {
          console.error(`Error for ${product.name} - ${angle}:`, error);
          results.push({ productId: product.id, angle, status: 'failed' });
          failed++;
        }
      }
    }

    console.log(`\n=== Batch Generation Complete ===`);
    console.log(`Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        generated, 
        skipped, 
        failed,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Batch generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
