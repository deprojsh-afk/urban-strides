import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  productId: string;
  productName: string;
  category: string;
  angle: 'front' | 'side' | 'back' | 'detail';
  existingImageUrl: string;
}

const getEditPromptForAngle = (category: string, angle: string): string => {
  const prompts: Record<string, string> = {
    side: `Show this exact same ${category.toLowerCase()} product from a side angle view. Keep the exact same design, colors, materials, and style. Professional product photography, studio lighting, white background, high quality.`,
    back: `Show this exact same ${category.toLowerCase()} product from the back/rear view. Maintain the exact same design, colors, materials, and style. Professional product photography, studio lighting, white background, high quality.`,
    detail: `Show a close-up detail shot of this exact same ${category.toLowerCase()} product, focusing on the texture, materials, and craftsmanship. Keep the same design and colors. Professional product photography, studio lighting, white background, high quality.`,
  };

  return prompts[angle] || `Show this product from a different angle. Keep the same design and style.`;
};

// Convert base64 data URL to Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
  // Remove data URL prefix if present
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  return decode(base64Data);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, productName, category, angle, existingImageUrl }: GenerateRequest = await req.json();
    
    if (!productId || !productName || !category || !angle || !existingImageUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: productId, productName, category, angle, existingImageUrl' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client for DB and Storage operations
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check if image already exists in DB
    const { data: existingImage } = await supabase
      .from('product_gallery_images')
      .select('image_url')
      .eq('product_id', productId)
      .eq('angle', angle)
      .single();

    if (existingImage) {
      console.log(`Image for ${productName} - ${angle} already exists in DB`);
      return new Response(
        JSON.stringify({ imageUrl: existingImage.image_url, angle, cached: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = getEditPromptForAngle(category, angle);
    console.log(`Generating ${angle} view for: ${productName} based on existing image`);

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
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: existingImageUrl,
                },
              },
            ],
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const base64ImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!base64ImageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'No image generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upload to Supabase Storage
    const fileName = `${productId}/${angle}.png`;
    const imageBytes = base64ToUint8Array(base64ImageUrl);
    
    const { error: uploadError } = await supabase.storage
      .from('product-gallery')
      .upload(fileName, imageBytes, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload image to storage' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-gallery')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    console.log(`Uploaded to storage: ${publicUrl}`);

    // Save URL to database
    const { error: insertError } = await supabase
      .from('product_gallery_images')
      .insert({
        product_id: productId,
        angle: angle,
        image_url: publicUrl,
      });

    if (insertError) {
      console.error('Failed to save image to DB:', insertError);
    } else {
      console.log(`Saved ${angle} image for ${productName} to database`);
    }

    console.log(`Successfully generated ${angle} image for ${productName}`);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, angle }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-product-images:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
