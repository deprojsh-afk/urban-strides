import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  productName: string;
  category: string;
  color?: string;
  angle: 'front' | 'side' | 'back' | 'detail';
}

const getPromptForAngle = (productName: string, category: string, color: string, angle: string): string => {
  const baseStyle = "professional product photography, studio lighting, white background, high quality, 4K, clean minimalist style";
  
  const categoryPrompts: Record<string, Record<string, string>> = {
    Shoes: {
      front: `${color} running shoes ${productName}, front view, ${baseStyle}`,
      side: `${color} running shoes ${productName}, side profile view showing sole and design, ${baseStyle}`,
      back: `${color} running shoes ${productName}, back heel view, ${baseStyle}`,
      detail: `${color} running shoes ${productName}, close-up of sole texture and material details, ${baseStyle}`,
    },
    Tops: {
      front: `${color} athletic running shirt ${productName}, front view on mannequin, ${baseStyle}`,
      side: `${color} athletic running shirt ${productName}, side view showing fit, ${baseStyle}`,
      back: `${color} athletic running shirt ${productName}, back view, ${baseStyle}`,
      detail: `${color} athletic running shirt ${productName}, close-up of fabric texture and stitching, ${baseStyle}`,
    },
    Accessories: {
      front: `${color} ${productName.toLowerCase()} sports accessory, front view, ${baseStyle}`,
      side: `${color} ${productName.toLowerCase()} sports accessory, side angle view, ${baseStyle}`,
      back: `${color} ${productName.toLowerCase()} sports accessory, back view, ${baseStyle}`,
      detail: `${color} ${productName.toLowerCase()} sports accessory, close-up detail shot, ${baseStyle}`,
    },
  };

  return categoryPrompts[category]?.[angle] || `${color} ${productName} ${angle} view, ${baseStyle}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, category, color = 'black', angle }: GenerateRequest = await req.json();
    
    if (!productName || !category || !angle) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: productName, category, angle' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = getPromptForAngle(productName, category, color, angle);
    console.log(`Generating image for: ${productName} - ${angle} view`);
    console.log(`Prompt: ${prompt}`);

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
            content: prompt,
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
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'No image generated' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully generated ${angle} image for ${productName}`);

    return new Response(
      JSON.stringify({ imageUrl, angle }),
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
