// SEO Metadata and Content for AI Creative Studio & Tools
// Contains structured titles, meta descriptions, canonical rules, guides, and FAQs for all 30+ routes.

export const SEO_DATA_CREATIVE_STUDIO = {
  // 1. AI Invitation & Card Maker
  'ai-card-maker': {
    title: 'Free AI Card Maker & Online Invitation Generator | All Tool Master',
    description: 'Create professional custom greeting cards and invitations online free with AI. Choose templates for weddings, birthdays, baby showers, and events.',
    h1: 'Free AI Invitation & Card Maker',
    introduction: 'Welcome to the ultimate AI-powered invitation and card creator. Designing elegant, personalized invitations for weddings, birthdays, corporate events, and festivals should not require complex graphic design software or expensive print shops. With All Tool Master, you can instantly generate bespoke card copy, choose premium design layouts, and customize styles to match your event perfectly. Generate elegant RSVPs, custom messages, and export layouts in high definition.',
    howTo: [
      'Enter the host name, event type, date, time, and venue details.',
      'Select a design template style (Modern, Minimal, Luxury, Corporate, Elegant Wedding, etc.).',
      'Choose the language and message tone (Witty, Formal, Casual, Joyful).',
      'Click Generate Content to let AI write custom greeting text and details.',
      'Customize fonts and background styles, then export as a print-ready PNG, JPG, or PDF.'
    ],
    features: [
      { title: 'AI-Generated Message Copy', desc: 'Let Gemini write custom RSVP and greeting text tailored to your message tone.' },
      { title: 'Premium Design Templates', desc: 'Choose from Modern, Luxury, Minimal, Floral, Traditional Indian, and Elegant designs.' },
      { title: 'High-Definition Exports', desc: 'Download your customized creations instantly in high-resolution PNG, JPG, or PDF layouts.' },
      { title: 'Contextual Sharing Tools', desc: 'Share your invitation link or design directly via WhatsApp, Instagram, Facebook, or Email.' }
    ],
    article: `
### Make Custom Cards and Invitations with AI
All Tool Master's AI Invitation Maker is designed to help you generate beautiful, personalized card templates for any event. Whether you need an ATS-vetted business invitation, an elegant floral wedding layout, or a bright birthday banner, our tool builds responsive, high-fidelity mockups.

### Create Professional Designs in Seconds
Traditional design platforms require hours of tweaking text alignments, font sizes, and grids. Our AI Invitation Maker automates copywriting and layouts:
* **Custom copy generation:** AI crafts the greeting, main invitation text, and clear RSVP directions.
* **Responsive templates:** Choose templates tailored for kids, gaming, elegant galas, or corporate conferences.
* **Instant download options:** Export to PNG for social sharing or PDF for high-quality paper printing.
`,
    faqs: [
      { question: 'Is the AI Card Maker free to use?', answer: 'Yes. All Tool Master provides this tool completely free with no registration or paywalls.' },
      { question: 'Can I export my invitation as a PDF?', answer: 'Yes. The tool supports high-quality PDF downloads that are ready for standard printing.' },
      { question: 'Does the tool support multiple languages?', answer: 'Yes. You can select your preferred language in the input options, and the AI will generate appropriate translations.' }
    ],
    relatedTools: ['/business-card-maker', '/youtube-thumbnail-maker']
  },

  // Card Maker Sub-pages
  '/birthday-card-maker': {
    title: 'Free Online Birthday Card Maker & Invitation Generator | All Tool Master',
    description: 'Design custom birthday invitations and cards with AI. Personalize name, theme, tone, and export high-quality PNG, JPG, or PDF templates instantly.',
    h1: 'AI Birthday Card Maker Online',
    introduction: 'Celebrate your special day with custom invitations. Our AI Birthday Card Maker writes unique birthday wishes, party details, and designs beautiful layouts for kids, gaming parties, or milestone celebrations.',
    howTo: ['Input the birthday person\'s name and party details.', 'Choose a theme (e.g. Kids, Gaming, Minimal, Modern).', 'Select your message tone and click Generate.', 'Download your birthday card as a high-quality PNG or print-ready PDF.'],
    features: [
      { title: 'Kids & Gaming Themes', desc: 'Fun templates customized specifically for children\'s parties and online gaming sessions.' },
      { title: 'Witty & Casual Tones', desc: 'Generate humorous, energetic, or warm wishes that match the birthday star\'s personality.' }
    ],
    article: '### Plan the Perfect Birthday Bash\nOur AI Birthday Card Maker takes the stress out of party planning. Simply paste in your details, select a fun background template (like gaming or colorful kids themes), and let the AI compose a catchy invitation that guests will love. Perfect for sharing via WhatsApp or printing locally.',
    faqs: [
      { question: 'Can I customize the fonts and colors?', answer: 'Yes. After generating, you can adjust the design styles, typography, and text positions on the canvas preview.' }
    ]
  },
  '/anniversary-card-maker': {
    title: 'Free Online Anniversary Card Maker & Greeting Generator | All Tool Master',
    description: 'Create beautiful wedding or work anniversary cards online. Let AI draft romantic or professional wishes and generate premium templates.',
    h1: 'AI Anniversary Card Maker',
    introduction: 'Commemorate milestones with custom designs. Write beautiful anniversary wishes for spouses, parents, or employees with custom text and luxury design elements.',
    howTo: ['Enter names, date, and anniversary year.', 'Select a Luxury or Elegant template.', 'Choose romantic or professional tone and click Generate.', 'Export high-definition JPG or PDF.'],
    features: [
      { title: 'Luxury & Floral Templates', desc: 'Sophisticated layouts featuring golden gradients and watercolor borders.' }
    ],
    article: '### Celebrating Milestones\nCreate romantic wedding anniversary greetings or clean milestone cards for corporate employees. The AI crafts heartfelt copy that highlights the journey, while the luxury backgrounds make it look like a professional agency design.',
    faqs: [{ question: 'Is there a limit on card generations?', answer: 'No, you can generate as many variations as you need.' }]
  },
  '/event-card-maker': {
    title: 'Free Online Event Invitation Maker & RSVP Generator | All Tool Master',
    description: 'Design custom invitations for conferences, charity galas, parties, and corporate events. Generate professional copy and export PDF layouts.',
    h1: 'AI Event Card Maker Online',
    introduction: 'Create invitations for webinars, community gatherings, or gala events. Our AI constructs RSVPs, details, and structures clean corporate or casual layouts.',
    howTo: ['Fill in event title, date, venue, and host.', 'Select Corporate or Minimal style.', 'Click Generate to compose professional details.', 'Download PNG or PDF.'],
    features: [
      { title: 'Corporate & Minimal Styles', desc: 'Neat, geometric layouts suitable for company meetups, conferences, and formal webinars.' }
    ],
    article: '### Professional Event Invitations\nOrganizing a webinar, charity auction, or workshop is hard enough. Save time by generating your invitation layouts and RSVP details instantly. Our event-optimized templates ensure clear typography for coordinates, dates, and RSVP requirements.',
    faqs: [{ question: 'Can I add a custom company logo?', answer: 'Yes, you can upload your logo inside the workspace and position it on the card.' }]
  },
  '/wedding-card-maker': {
    title: 'Free Online Wedding Invitation Maker & Card Generator | All Tool Master',
    description: 'Create elegant wedding invitations and RSVPs online. Personalize floral or traditional templates with AI-generated invitation messages.',
    h1: 'AI Wedding Invitation Maker',
    introduction: 'Design your dream wedding invitations online. Our wedding builder integrates traditional motifs, floral designs, and premium font hierarchies for your special day.',
    howTo: ['Input couple names, ceremony details, venue, and RSVP date.', 'Select Elegant Wedding, Floral, or Traditional Indian template.', 'Click Generate to write beautiful wedding invitation copy.', 'Download high-res JPG/PDF.'],
    features: [
      { title: 'Floral & Traditional Motifs', desc: 'Handcrafted styles featuring gold trims, wedding frames, and floral vector decorations.' }
    ],
    article: '### Design Beautiful Wedding Invitations\nYour wedding card should reflect the elegance of your ceremony. Choose from classic calligraphy styles, romantic floral borders, or traditional patterns. The AI generates custom phrasing—from formal invitations to casual party briefs—ensuring your guests are fully informed.',
    faqs: [{ question: 'Can I print these wedding invitations?', answer: 'Yes. Export the card as a PDF to print it in high resolution at any print shop.' }]
  },
  '/baby-shower-card-maker': {
    title: 'Free Online Baby Shower Invitation Creator | All Tool Master',
    description: 'Create cute baby shower invitations online free. AI generates adorable card messages, schedules, and pastel-colored templates.',
    h1: 'AI Baby Shower Invitation Maker',
    introduction: 'Welcome the new arrival with lovely cards. Custom baby shower templates with pastel palettes, cute illustrations, and playful wording.',
    howTo: ['Enter parents\' names, date, and registry details.', 'Choose Kids or Floral theme.', 'Select playful or warm tone and click Generate.', 'Download PNG or PDF.'],
    features: [
      { title: 'Pastel Design Palettes', desc: 'Soft pinks, blues, and neutral tones suitable for any baby shower theme.' }
    ],
    article: '### Adorable Baby Shower Cards\nPrepare for your bundle of joy with customized invitations. Our AI generator drafts warm messages, schedules, and registry information, placing them in beautifully aligned pastel layouts.',
    faqs: [{ question: 'Can I use this for gender reveal parties?', answer: 'Yes, just customize the event type input to "Gender Reveal" and the AI will tailor the text.' }]
  },
  '/housewarming-card-maker': {
    title: 'Free Online Housewarming Invitation Maker | All Tool Master',
    description: 'Create custom home-warming and griha pravesh invitations. AI writes warm welcome text for friends and family with map link support.',
    h1: 'AI Housewarming Card Maker',
    introduction: 'Invite friends and family to your new home. Generate cozy, warm welcome cards with clear directions, house details, and elegant layouts.',
    howTo: ['Input names, new home address, and housewarming date.', 'Choose Modern or Minimal style.', 'Click Generate to write custom welcome notes.', 'Download PNG or PDF.'],
    features: [
      { title: 'Griha Pravesh Support', desc: 'Tailored templates and copy styles for traditional Indian housewarmings.' }
    ],
    article: '### Welcome Guests to Your New Home\nMoving is a major milestone. Celebrate it by sending lovely invitations to your housewarming party. Simply enter your new address, choose a cozy style, and let AI draft a welcoming note.',
    faqs: [{ question: 'Can I include a digital map link?', answer: 'Yes, you can paste a Google Maps link in the venue field and it will be rendered clearly.' }]
  },
  '/festival-card-maker': {
    title: 'Free Online Festival Greetings & Card Maker | All Tool Master',
    description: 'Create beautiful cards for Diwali, Christmas, Eid, Holi, and New Year. AI writes traditional greetings with festive templates.',
    h1: 'AI Festival Greeting Card Maker',
    introduction: 'Send warm blessings to your loved ones. Generate beautiful greeting cards for all global festivals with custom messages and vibrant styles.',
    howTo: ['Select the festival type (Diwali, Christmas, Eid, etc.).', 'Choose Traditional or Minimal style.', 'Click Generate to write festival-specific blessings.', 'Export PNG/JPG.'],
    features: [
      { title: 'Global Festival Templates', desc: 'Vibrant colors, lanterns, wreaths, and star motifs for cultural events worldwide.' }
    ],
    article: '### Share the Joy of Festive Seasons\nWhether it is Diwali, Eid, Christmas, or New Year, sending a personalized greeting card connects you with friends, family, and clients. Our AI creates unique blessings, saving you from copy-pasting generic internet templates.',
    faqs: [{ question: 'Can I batch export greetings?', answer: 'Yes, customize the name input for different friends and download cards individually.' }]
  },
  '/thank-you-card-maker': {
    title: 'Free Online Thank You Card Maker & Gratitude Card | All Tool Master',
    description: 'Express gratitude with custom thank you cards. Let AI write appreciative messages for weddings, gifts, or support.',
    h1: 'AI Thank You Card Maker',
    introduction: 'Show your appreciation. Design neat, heartwarming thank you cards for clients, wedding guests, or friends using AI copywriting.',
    howTo: ['Enter the recipient\'s name and why you are thanking them.', 'Select Minimal or Floral theme.', 'Click Generate to draft sincere appreciation texts.', 'Download JPG/PDF.'],
    features: [
      { title: 'Heartfelt Appreciations', desc: 'Tailored message tone options to express deep gratitude or professional appreciation.' }
    ],
    article: '### Sincere Thank You Notes\nSaying thank you leaves a lasting impression. Our tool helps you write custom cards, perfect for wedding guest follow-ups, business client greetings, or thanking friends for birthday gifts.',
    faqs: [{ question: 'Can I use this for business client appreciation?', answer: 'Yes, select a professional message tone and minimal style for corporate thank-you notes.' }]
  },
  '/farewell-card-maker': {
    title: 'Free Online Farewell Card Maker & Goodbye Greeting | All Tool Master',
    description: 'Create custom farewell cards for colleagues, bosses, or friends. AI writes professional or emotional goodbye messages.',
    h1: 'AI Farewell Card Maker Online',
    introduction: 'Bid farewell with style. Generate custom goodbye cards, retirement greetings, or relocation wishes with professional design templates.',
    howTo: ['Enter coworker\'s name and department/company.', 'Select Corporate or Casual style.', 'Click Generate to write supportive farewell copy.', 'Download PDF.'],
    features: [
      { title: 'Relocation & Retirement', desc: 'Custom text configurations for retirees, colleagues leaving for new jobs, or friends relocating.' }
    ],
    article: '### Bid Coworkers a Fond Farewell\nSaying goodbye to a valued colleague is easier with a beautiful card. Our AI writes professional yet warm farewell copy, perfect for office signature boards or digital cards.',
    faqs: [{ question: 'Can I print it out for office signatures?', answer: 'Yes. Download as a PDF, print it in folder-style layout, and let the team sign it.' }]
  },
  '/business-invitation-maker': {
    title: 'Free Online Business Invitation Creator & Meeting Card | All Tool Master',
    description: 'Design professional invitations for corporate launches, seminars, and networking events. Integrate logos and clean typography.',
    h1: 'AI Business Invitation Maker',
    introduction: 'Invite stakeholders, partners, and clients. Create professional business cards, corporate launches, or summit invitations with AI.',
    howTo: ['Input company name, event topic, dates, and speaker info.', 'Choose Corporate template.', 'Select formal message tone and click Generate.', 'Download PDF.'],
    features: [
      { title: 'ATS-grade Alignment', desc: 'Perfect alignments, geometric grids, and high contrast typography for professional look.' }
    ],
    article: '### Expand Your Corporate Reach\nSend highly professional invitations for your company\'s annual summit, charity gala, or product launch. Our templates follow business branding guidelines with high-contrast text block options.',
    faqs: [{ question: 'Can I insert my brand color code?', answer: 'Yes, you can edit the template palette directly in the preview dashboard.' }]
  },

  // 2. AI Watermark / Logo Cleanup Tool
  'watermark-remover': {
    title: 'Free AI Watermark Remover Online - Cleanup Photo overlays | All Tool Master',
    description: 'Remove watermarks, logos, text overlays, timestamps, and screenshot markings from your images online free with AI content-aware inpainting.',
    h1: 'AI Watermark & Logo Cleanup Tool',
    introduction: 'Welcome to the premium AI Watermark Remover. Easily clean up user-owned screenshots, erase distracting timestamps, remove text overlays, and wipe out unwanted brand stamps. Utilizing intelligent client-side canvas inpainting and background texture reconstruction, you can clean up images instantly without copyright infringement risks. Free, fast, and completely in-browser.',
    howTo: [
      'Upload your target JPG, PNG, or WEBP image to the editor dropzone.',
      'Choose Automatic AI Detection to scan the image and auto-mark text overlays or logos.',
      'Or select Manual Selection Mode and use the Brush or Rectangle tool to paint over unwanted areas.',
      'Click the "Remove" button to execute content-aware intelligent texture recovery.',
      'Review the cleaned preview, select your output format (PNG, JPG, WEBP), and click Download.'
    ],
    features: [
      { title: 'Automatic Region Detection', desc: 'Smart AI scans for contrast boundaries to auto-highlight logos and timestamps.' },
      { title: 'Interactive Brush & Lasso', desc: 'Precise manual control options to mark irregular overlays or screenshot markings.' },
      { title: 'Edge & Texture Reconstruction', desc: 'Rebuilds natural pixel textures and background structures behind the erased object.' },
      { title: 'Completely Client-Side', desc: 'Processes pixels locally in your browser to guarantee ultimate data privacy and instant execution.' }
    ],
    article: `
### Clean Up Distracting Overlays Online
Distracting text, camera timestamps, or old logos can render an otherwise beautiful photo unusable. Our Watermark Remover restores the original background details using client-side canvas interpolation:
* **Erase text overlays:** Instantly clear captions, quotes, or screenshot elements.
* **Remove timestamps:** Clean old date stamps from scanned vintage family photos.
* **Smart texture fill:** The tool uses neighboring pixel values to patch the erased region naturally, preserving gradients and details.

### Respecting Content Ownership
*Note: This utility is built to assist users in editing their own media assets, cleaning up screenshot captures, and archiving personal files. We strictly discourage the use of this tool for copyright infringement or removing legitimate commercial intellectual property labels.*
`,
    faqs: [
      { question: 'Does the tool upload my photos to any server?', answer: 'No. The image cleanup is performed completely on your device using client-side canvas rendering, ensuring your data is 100% private.' },
      { question: 'What image formats are supported?', answer: 'You can upload JPG, PNG, WEBP, and HEIC files.' },
      { question: 'Can I undo my manual selections?', answer: 'Yes, the manual editor includes a clear "Eraser" tool and "Reset" capability to modify marked areas.' }
    ],
    relatedTools: ['/object-remover', '/background-remover']
  },

  // Watermark sub-pages
  '/remove-watermark-online': {
    title: 'Remove Watermark Online Free - AI Image Cleanup | All Tool Master',
    description: 'Wipe out watermarks and overlay stamps from photos instantly. High-quality client-side AI inpainting with no quality loss.',
    h1: 'Remove Watermark Online Free',
    introduction: 'Restore your image backgrounds. Easily clean up watermark stamps, unwanted graphics, and transparent overlays from personal photos in seconds.',
    howTo: ['Upload image.', 'Brush over the watermark stamp.', 'Click Remove to blend background.', 'Download watermark-free image.'],
    features: [{ title: 'Lossless Cleanup', desc: 'Erases the marked overlays while keeping the underlying image resolution intact.' }],
    article: '### Reclaim Your Image Layouts\nWatermarks can distract from the main subject of your photos. Our online cleanup tool uses modern inpainting algorithms to detect boundaries and seamlessly fill the area, leaving no blurry smudges behind.',
    faqs: [{ question: 'Does it support bulk removal?', answer: 'Currently, you can clean images one-by-one to ensure maximum precision.' }]
  },
  '/remove-logo-from-image': {
    title: 'Remove Logo from Image Free - AI Logo Cleanup | All Tool Master',
    description: 'Erase logos, branding icons, and promotional overlays from your graphics. Intelligent content-aware pixel replacement.',
    h1: 'Remove Logo from Image Free',
    introduction: 'Remove corporate stamps, old logos, or branding vectors from your image templates. Perfect for creating clean reference images.',
    howTo: ['Select the logo region with the rectangle selector.', 'Click Clean to reconstruct the background textures.', 'Export as WEBP or PNG.'],
    features: [{ title: 'Rebuild Backgrounds', desc: 'Smart interpolation rebuilds textures, colors, and shadows behind corporate logo shapes.' }],
    article: '### Clear Branding Elements Fast\nIf you have a template with an outdated company logo or badge, you do not need to rebuild the file from scratch. Use our logo eraser to wipe the icon and let the AI fill in the background gradients automatically.',
    faqs: [{ question: 'Can it erase complex emblem logos?', answer: 'Yes. For detailed emblems, use the brush tool to cover the exact boundaries before processing.' }]
  },
  '/remove-text-from-image': {
    title: 'Remove Text from Image Online Free - AI Text Eraser | All Tool Master',
    description: 'Wipe text captions, memes, screenshots, and quotes from pictures. Keep the original photo background clean.',
    h1: 'Remove Text from Image Online',
    introduction: 'Erase distracting text blocks, subtitle overlays, or meme texts from photos without smudging. Safe, fast, and completely in-browser.',
    howTo: ['Upload image.', 'Use the brush to cover the text characters.', 'Click Remove to fill in the background.', 'Save the clean photo.'],
    features: [{ title: 'Subtitle Eraser', desc: 'Perfect for removing subtitles and text strips from film frames or screenshot uploads.' }],
    article: '### Erase Text Without Smearing\nUnlike basic photo editors that paint a solid color over text, our AI text remover analyzes the surrounding texture and continues the pattern (wood grain, sky gradients, brick walls) behind the letters.',
    faqs: [{ question: 'Is the text removal permanent?', answer: 'Yes, it outputs a new file. Your original file remains untouched on your device.' }]
  },
  '/remove-timestamp-from-photo': {
    title: 'Remove Timestamp from Photo Online Free | All Tool Master',
    description: 'Erase digital camera timestamps, date overlays, and battery status metrics from old scanned photographs.',
    h1: 'Remove Timestamp from Photo Online',
    introduction: 'Clean up vintage date stamps. Erase orange digital camera timestamps and camera overlays from your digital photo archives.',
    howTo: ['Upload old photograph.', 'Draw a bounding box around the timestamp numbers.', 'Click Remove to restore the image corner.', 'Download clean JPG.'],
    features: [{ title: 'Vintage Photo Restorer', desc: 'Easily clear 90s camera date stamps from scanned family photos.' }],
    article: '### Restore Old Memories\nMany digital cameras from the 90s and 2000s embedded orange timestamps on the bottom right corner of photos. Restoring these pictures is easy: simply brush over the date text, and our tool reconstructs the original corner texture.',
    faqs: [{ question: 'Does it affect image quality?', answer: 'No, only the marked pixels in the corner are modified.' }]
  },

  // 3. AI Object Remover
  'object-remover': {
    title: 'Free AI Object Remover Online - Erase People & Objects | All Tool Master',
    description: 'Erase unwanted people, objects, animals, power lines, and background distractions from photos free with AI inpainting.',
    h1: 'AI Object Remover Online',
    introduction: 'Welcome to the professional AI Object Remover. Did a random passerby spoil your perfect vacation shot? Are power lines, trash cans, or vehicles cluttering your landscape background? Our tool uses advanced client-side inpainting and context-fill algorithms to erase any unwanted element and reconstruct the background texture naturally.',
    howTo: [
      'Upload your JPG, PNG, or WEBP photo to the canvas.',
      'Select Automatic Mode to let the system auto-detect people, vehicles, or animals in the frame.',
      'Or use Manual Mode with the Brush, Smart Selection, or Polygon tool to paint over the object.',
      'Click the "Remove" button to execute background reconstruction.',
      'Download your cleaned photograph in PNG, JPG, or WEBP format.'
    ],
    features: [
      { title: 'Intelligent Inpainting', desc: 'Fills the target area by borrowing matching texture patches from the rest of the image.' },
      { title: 'Erase People & Vehicles', desc: 'Perfect for clearing busy tourist spots, removing cars, signs, or background wires.' },
      { title: 'Shadow & Reflection Recovery', desc: 'Corrects lighting, colors, and shadows around the removed object for a natural look.' }
    ],
    article: `
### Erase Distractions from Any Picture
All Tool Master's Object Remover lets you create clean, professional-grade compositions without Photoshop. Clear out messy backgrounds, remove photobombers, and isolate your subject:
* **Erase people from photos:** Instantly remove tourists, crowds, or photobombers from wedding, travel, or portrait shots.
* **Remove signs, wires, and trash:** Cleanup street photography by wiping out electrical lines, traffic signs, and garbage bins.
* **Context-aware background reconstruction:** Our system doesn't just blur the region; it recalculates patterns, keeping horizons, brick lines, and tree foliage aligned.
`,
    faqs: [
      { question: 'How precise is the object remover?', answer: 'Very. The manual Brush tool lets you adjust the tip size down to a single pixel to trace complex boundaries like wires or tree branches.' },
      { question: 'Is there a limit on file size?', answer: 'You can upload images up to 50MB. Processing is done client-side so it depends on your browser performance.' }
    ],
    relatedTools: ['/watermark-remover', '/background-remover']
  },

  // Object remover sub-pages
  '/remove-person-from-photo': {
    title: 'Remove Person from Photo Online Free - AI Inpainting | All Tool Master',
    description: 'Erase photobombers, tourists, and crowds from your photos online. Real-time background restoration and shadow recovery.',
    h1: 'Remove Person from Photo Online',
    introduction: 'Clear out photobombers and tourists. Our AI-powered tool lets you remove people from any image and seamlessly fills the space.',
    howTo: ['Upload travel photo.', 'Brush over the person you want to remove.', 'Click Remove.', 'Download clean photo.'],
    features: [{ title: 'Photobomb Eraser', desc: 'Wipe background crowds and isolate your portrait subject.' }],
    article: '### Clear Tourists and Crowds\nCapturing popular sights without crowds is almost impossible. Simply upload your vacation shots, brush over the tourists in the background, and click remove. The AI reconstructs the building facade or natural scenery behind them.',
    faqs: [{ question: 'Can I remove multiple people at once?', answer: 'Yes. Mark all individuals in one go using the brush, then click Remove.' }]
  },
  '/remove-object-from-photo': {
    title: 'Remove Object from Photo Online Free - AI Cleanup | All Tool Master',
    description: 'Erase wires, signs, trash cans, and cars from your images. Content-aware fill restores original details.',
    h1: 'Remove Object from Photo Online',
    introduction: 'Erase power lines, signs, or trash cans from landscape or urban photos. Rebuild textures seamlessly.',
    howTo: ['Upload image.', 'Highlight the unwanted object.', 'Click Remove.', 'Save the restored image.'],
    features: [{ title: 'Context-Aware Fill', desc: 'Maintains geometric lines like horizons, tiles, and architecture.' }],
    article: '### Urban Cleanups Made Easy\nRemove power lines cutting through the sky, fire hydrants, street signs, or trash bins. Our algorithm fills the empty space by matching the surrounding textures, ensuring a natural blend.',
    faqs: [{ question: 'Does this tool work on sky gradients?', answer: 'Yes, it blends gradients smoothly without leaving visible seam lines.' }]
  },
  '/remove-unwanted-things-from-image': {
    title: 'Remove Unwanted Things from Image Online Free | All Tool Master',
    description: 'Clean up clutter, debris, wires, and minor spots from your digital graphics using AI pixel fill.',
    h1: 'Remove Unwanted Things from Image',
    introduction: 'Wipe blemishes, dust spots, lens flare, or random debris from product and portrait photos.',
    howTo: ['Upload your image.', 'Zoom in and brush over minor imperfections.', 'Click Remove.', 'Download clean graphic.'],
    features: [{ title: 'Spot Healing', desc: 'Erase dust, scratches, and lens spots from scanned or digital files.' }],
    article: '### Professional Product Photo Cleaning\nClean up scratches, dust, or light reflections from your product mockups. Our tool heals the target spot using neighboring texture blocks, giving you a studio-quality catalog render.',
    faqs: [{ question: 'Is there a zoom tool?', answer: 'Yes, you can zoom and pan to make precise selections on smaller objects.' }]
  },

  // 4. AI Background Remover
  'background-remover': {
    title: 'Free AI Background Remover Online - Transparent PNG | All Tool Master',
    description: 'Remove backgrounds from images online free in one click. Generate transparent PNG files, add solid color or custom backgrounds.',
    h1: 'AI Background Remover Online',
    introduction: 'Welcome to the premium AI Background Remover. Instantly isolate your subject—whether it is a person, product, or animal—and extract a clean, transparent PNG cutout. Easily replace the original background with solid colors, stylish gradients, or upload custom graphics. Fast, accurate, and completely free.',
    howTo: [
      'Upload your JPG, PNG, or WEBP image to the editor.',
      'Click Remove Background to trigger automatic foreground extraction.',
      'Review the transparent preview cutout.',
      'Optional: Select a solid color or gradient background, or upload a custom backdrop.',
      'Export your final composition as a transparent PNG or high-quality JPG.'
    ],
    features: [
      { title: 'One-Click Extraction', desc: 'Extracts subjects from busy backgrounds instantly with high edge precision.' },
      { title: 'Transparent PNG Maker', desc: 'Saves clean cutouts with alpha channels for overlays, collages, or e-commerce listing templates.' },
      { title: 'Custom Backdrop Replacements', desc: 'Add solid branding colors, professional gradients, or custom uploaded scene designs.' }
    ],
    article: `
### Erase and Replace Image Backgrounds Instantly
Our Background Remover is optimized for e-commerce sellers, graphic designers, and content creators:
* **Transparent PNG Cutouts:** Perfect for product listings on Amazon, eBay, or Shopify.
* **Professional Headshots:** Swap a messy bedroom background for a sleek, corporate gradient or solid gray layout.
* **Custom collages and cards:** Isolate family members, pets, or graphics and combine them on custom invitation templates.
`,
    faqs: [
      { question: 'Is the transparency edge clean?', answer: 'Yes. The algorithm traces hair strands, clothing lines, and product contours to minimize fuzzy borders.' },
      { question: 'Can I add my own background image?', answer: 'Yes. The background panel lets you upload any secondary image to place behind the cutout.' }
    ],
    relatedTools: ['/watermark-remover', '/object-remover']
  },
  '/remove-background-online': {
    title: 'Remove Background Online Free - Transparent PNG | All Tool Master',
    description: 'Erase image backdrops online free. Isolate people, products, or vectors with one-click background extraction.',
    h1: 'Remove Background Online Free',
    introduction: 'Instantly remove image backdrops. Perfect for listing assets, social media posts, and design mockups.',
    howTo: ['Upload photo.', 'Click Extract.', 'Preview transparent results.', 'Download PNG.'],
    features: [{ title: 'E-Commerce Optimized', desc: 'Extract clean product frames for catalogs and marketing materials.' }],
    article: '### Studio Quality Backdrops\nSave hours of manual masking. Our tool isolates the main subject and removes the background in seconds, giving you a clean template ready for social media banners or flyer designs.',
    faqs: [{ question: 'What is the maximum resolution?', answer: 'We preserve the original image dimensions up to 4K resolutions.' }]
  },
  '/transparent-png-maker': {
    title: 'Free Transparent PNG Maker Online - Cutout Creator | All Tool Master',
    description: 'Convert JPG to transparent PNG. Isolate graphics, signatures, or logos and export with alpha channel transparency.',
    h1: 'Free Transparent PNG Maker',
    introduction: 'Convert solid backgrounds to transparent. Create overlay elements, signature cutouts, and logos with alpha channels.',
    howTo: ['Upload graphic or image.', 'Select background color to remove.', 'Click Process.', 'Export transparent PNG.'],
    features: [{ title: 'Alpha Channel Preservation', desc: 'Saves transparent files with proper transparency metadata for editing programs.' }],
    article: '### Create Transparent Overlays\nNeed to place a signature, drawing, or logo on top of a document or presentation? Use our PNG cutout maker to erase solid color backgrounds, leaving a clean, transparent vector element.',
    faqs: [{ question: 'Does it support transparency in Word?', answer: 'Yes, PNG files maintain transparency when inserted into Microsoft Word or Google Docs.' }]
  },

  // 5. AI Logo Generator
  'ai-logo-generator': {
    title: 'Free AI Logo Generator Online - Custom Logo Maker | All Tool Master',
    description: 'Generate professional custom logos online free with AI. Enter business name and industry to get multiple concepts in PNG, SVG, PDF.',
    h1: 'AI Logo Generator Online',
    introduction: 'Welcome to the AI Logo Generator. Launching a new brand, startup, YouTube channel, or blog? Our tool generates multiple unique brand concepts, typography sets, and slogans. Customize fonts, spacing, and layouts, then download high-resolution vectors in PNG, SVG, and PDF formats.',
    howTo: [
      'Enter your Business Name and optional tagline.',
      'Select your Industry (Tech, Food, Fashion, Real Estate, etc.).',
      'Choose a logo style (Minimalist, Emblem, Corporate, Monogram).',
      'Select color preferences and click Generate concepts.',
      'Edit the design parameters in the preview editor and download as SVG, PNG, or PDF.'
    ],
    features: [
      { title: 'Vector SVG Exports', desc: 'Saves logos in fully scalable SVG formats, perfect for website headers and large banner printing.' },
      { title: 'Multiple Brand Concepts', desc: 'Generates minimalist, abstract, emblem, and initials layouts to give you creative options.' },
      { title: 'Contextual Branding Assets', desc: 'Generates primary color hex values, suggested secondary fonts, and slogan taglines.' }
    ],
    article: `
### Create Stunning Logos for Your Brand
A professional logo is key to building business authority. Our AI Logo Maker combines smart typography principles and graphic elements:
* **Custom SVG Icons:** The AI creates scalable layouts using vector geometries, ensuring your brand icon never looks pixelated.
* **Branding Packages:** Get suggested brand hex code values and matching Google Fonts to keep your site aesthetic consistent.
* **Canva Pro Integration:** *"Need professional branding assets? Explore Canva Pro."* We provide direct hooks to customize your brand kits.
`,
    faqs: [
      { question: 'Do I own the rights to the generated logo?', answer: 'Yes. All generated assets are free to use for personal or commercial projects.' },
      { question: 'Can I download the logo in vector format?', answer: 'Yes. We provide SVG downloads which are fully editable in Illustrator or Figma.' }
    ],
    relatedTools: ['/business-card-maker', '/qr-code-generator']
  },
  '/logo-generator': {
    title: 'Free Logo Generator - Design Brand Assets Online | All Tool Master',
    description: 'Design professional business logos in minutes. Customize icons, typography, and color schemes online free.',
    h1: 'Free Logo Generator Online',
    introduction: 'Generate custom branding assets. Ideal for entrepreneurs, developers, and creators needing instant icons.',
    howTo: ['Input business name.', 'Select style preferences.', 'Browse generated layouts.', 'Export SVG or PNG.'],
    features: [{ title: 'Brand Kits', desc: 'Provides coordinating font schemes and primary/secondary color hex codes.' }],
    article: '### Design Logos Without Hiring Agencies\nLaunching a side project or website? Skip expensive design fees. Our logo creator proposes clean typography and geometric icon pairings, ready for Vercel, Netlify, or Shopify deployments.',
    faqs: [{ question: 'Can I edit the text alignment?', answer: 'Yes, the editor lets you reposition the icon relative to the text.' }]
  },
  '/free-logo-maker': {
    title: 'Free Logo Maker - Custom Business Brand Creator | All Tool Master',
    description: 'Build your own logo free. Choose emblem or minimalist templates, customize colors, and download print-ready files.',
    h1: 'Free Logo Maker Online',
    introduction: 'Build custom business logos. Easily generate branding ideas for local shops, startups, or social media pages.',
    howTo: ['Enter name and slogan.', 'Select industry theme.', 'Pick a template layout.', 'Download high-quality files.'],
    features: [{ title: 'Emblem & Monogram Presets', desc: 'Pre-aligned classic layouts for high-impact company emblems.' }],
    article: '### Stand Out from Competitors\nCreate unique monograms or emblems. Select from professional corporate palettes (navy, teal) or warm casual colors (orange, gold). Download print-ready files for cards or shirts.',
    faqs: [{ question: 'What is the download resolution?', answer: 'PNG downloads export at 2000x2000 pixels with high contrast.' }]
  },

  // 6. QR Code Generator
  'qr-code-generator': {
    title: 'Free Custom QR Code Generator Online - SVG, PNG | All Tool Master',
    description: 'Generate custom QR codes online free. Create WiFi QR, URL QR, business card QR, WhatsApp, and email QR codes with custom colors and logos.',
    h1: 'Custom QR Code Generator',
    introduction: 'Welcome to the QR Code Generator. Create customized, scannable QR codes for your business or personal use. Supports URL directions, WiFi logins, vCard business details, PDF sheets, WhatsApp messages, and direct email templates. Customize colors (including gradients!), corner shapes, and overlay a company logo.',
    howTo: [
      'Select your QR Code Mode (URL, WiFi, vCard, WhatsApp, Email, PDF).',
      'Input the required parameters (SSID, phone number, text, or website link).',
      'Select dot shapes, corner designs, and pick solid colors or custom gradient values.',
      'Optional: Upload a logo to embed in the center of the QR code.',
      'Download your custom QR code as a PNG, SVG, or PDF.'
    ],
    features: [
      { title: 'WiFi & vCard QR Modes', desc: 'Scan to join WiFi networks or save contact details directly to mobile phonebooks.' },
      { title: 'Gradient Customizations', desc: 'Stylize code dots using beautiful color gradients to match your brand style.' },
      { title: 'Embed Brand Logos', desc: 'Include a custom PNG/JPG logo at the center of the QR matrix without losing scannability.' }
    ],
    article: `
### Modern QR Code Solutions for Businesses
QR codes connect print media to digital channels. Our generator supports diverse business use cases:
* **Restaurant Menu QR:** Link customers directly to your online PDF menu.
* **WiFi Share QR:** Place scannable cards in hotel lobbies, cafes, or guest rooms to join SSID networks without passwords.
* **vCard Business Cards:** Embed your contact information so clients can scan and save details in one click.
`,
    faqs: [
      { question: 'Do these QR codes expire?', answer: 'No. They contain static data and will work indefinitely as long as the underlying URL or SSID remains active.' },
      { question: 'What format should I use for printing?', answer: 'For large printing (posters, banners), download the SVG format as it is fully vector and will not pixelate.' }
    ],
    relatedTools: ['/business-card-maker', '/ai-logo-generator']
  },
  '/free-qr-generator': {
    title: 'Free QR Code Generator - Custom Colors & Logos | All Tool Master',
    description: 'Create customized QR codes online free. Customize colors, add logos, and generate URL, WiFi, or WhatsApp codes.',
    h1: 'Free QR Code Generator Online',
    introduction: 'Generate custom QR codes. Easily customize code patterns, gradients, and overlay brand logo vectors.',
    howTo: ['Choose URL or WiFi mode.', 'Input data.', 'Customize colors and dots.', 'Download PNG or SVG.'],
    features: [{ title: 'Scan Tracking Safe', desc: 'Our static QR codes are direct and do not pass through tracking redirects, protecting user privacy.' }],
    article: '### Make Your QR Codes Look Professional\nStandard black-and-white QR codes can look boring. Customize the corner points and dots to match your company design system. The tool maintains code scannability requirements while blending gradients.',
    faqs: [{ question: 'Can I add my logo?', answer: 'Yes, upload a logo to center overlay. The QR code has 30% error-correction headroom to keep it scannable.' }]
  },

  // 7. Business Card Maker
  'business-card-maker': {
    title: 'Free Online Business Card Maker - Custom Visiting Cards | All Tool Master',
    description: 'Design professional business cards online free. Choose templates, generate AI layouts, integrate logos, QR codes, and export PDF.',
    h1: 'AI Business Card Maker',
    introduction: 'Welcome to the Business Card Maker. Create professional, printable business and visiting cards. Fill in your contact info, upload your corporate logo, integrate custom QR codes, and pick from pre-aligned geometric layouts. Download front and back templates in print-ready PDF formats.',
    howTo: [
      'Fill in your name, job title, company name, address, website, and phone number.',
      'Select a design layout (Modern, Minimalist, Corporate, Creative).',
      'Upload a company logo and position it on the card layout.',
      'Generate a vCard QR code and integrate it on the back layout.',
      'Download front and back templates as print-ready high-resolution PDFs.'
    ],
    features: [
      { title: 'Print-Ready PDF Layouts', desc: 'Exports card templates at standard 3.5" x 2" dimensions with standard safety bleeds.' },
      { title: 'vCard QR Code Integration', desc: 'Includes a scan-to-save contact QR code on the back page of your business card.' },
      { title: 'Drag & Drop Workspace', desc: 'Allows positioning of logo nodes, text alignments, and branding color selections.' }
    ],
    article: `
### Design Visiting Cards for Networking
A visiting card bridges digital contact info and physical encounters. Our maker structures ATS-aligned, geometric layouts:
* **Front layout:** Focuses on clean typography, title highlights, and your logo.
* **Back layout:** Focuses on branding, slogans, and contact QR codes.
* **Canva Pro Partner:** *"Need professional branding assets? Explore Canva Pro."* Tap into advanced mockups and printing services.
`,
    faqs: [
      { question: 'What is the standard size of a business card?', answer: 'Our templates follow the standard business card dimension: 3.5 inches by 2 inches (plus 0.125" bleed boundary).' },
      { question: 'Can I choose my own font style?', answer: 'Yes, the editor supports modern Google Fonts including Outfit, Inter, and Roboto.' }
    ],
    relatedTools: ['/ai-logo-generator', '/qr-code-generator']
  },
  '/visiting-card-maker': {
    title: 'Free Visiting Card Maker Online - Printable Cards | All Tool Master',
    description: 'Design custom visiting cards online free. Fill in details, customize templates, and download high-resolution front and back layouts.',
    h1: 'Printable Visiting Card Maker',
    introduction: 'Design custom visiting cards for personal and business branding. Clean typography, quick styling, and ready for printing.',
    howTo: ['Input company info and coordinates.', 'Choose a layout style.', 'Apply color themes.', 'Download front/back PDF.'],
    features: [{ title: 'Grid Guides', desc: 'Automatic alignment lines keep text blocks, logos, and QR codes aligned.' }],
    article: '### Create Memorable Visiting Cards\nWhether you are a freelancer, local business owner, or software developer, having a visiting card makes networking easy. Generate matching front and back card graphics, containing scannable QR codes for contact details.',
    faqs: [{ question: 'Does it support printing on cardstock?', answer: 'Yes. The downloaded PDF maintains high-fidelity vector text layouts suitable for premium cardstock printing.' }]
  },

  // 8. YouTube Thumbnail Maker
  'youtube-thumbnail-maker': {
    title: 'Free AI YouTube Thumbnail Maker - Custom Cover Maker | All Tool Master',
    description: 'Design catchy YouTube thumbnails online free. Add text overlays, use outline effects, customize gradients, and download 1280x720 cover images.',
    h1: 'AI YouTube Thumbnail Maker',
    introduction: 'Welcome to the YouTube Thumbnail Maker. Increase your CTR (click-through rate) with eye-catching, high-impact video cover designs. Upload a background image or use custom gradients, drag-and-drop text boxes, apply cool outline/glow fonts, and embed graphic elements (such as play icons or alert badges). Download in standard 1280x720 resolution.',
    howTo: [
      'Upload your main background photograph or select a vibrant color gradient.',
      'Select a cover template layout (Tech, Reaction, Tutorial, Gaming).',
      'Add catching text overlays, select typography, and apply outline stroke and shadows.',
      'Position graphics, frames, or custom badges on the canvas.',
      'Export the finished image as a high-quality JPG or PNG.'
    ],
    features: [
      { title: 'Click-Through Rate Boosters', desc: 'High-contrast text outline layouts and glowing overlays designed to grab attention.' },
      { title: 'Standard 1280x720 Export', desc: 'Writers get covers in YouTube\'s exact recommended resolution and aspect ratio (16:9).' },
      { title: 'Drag & Rotate Elements', desc: 'Easily drag, resize, rotate, and layer text overlays and graphics on the preview board.' }
    ],
    article: `
### Design Catchy YouTube Covers Online
Thumbnails make or break a video\'s success. All Tool Master\'s cover maker provides professional creator tools:
* **High Contrast Typography:** Apply solid outlines (strokes) and drop-shadows to ensure text remains legible on small screens.
* **Reaction layout presets:** Pre-aligned spaces for face cutouts and big text headings.
* **Optimize for mobile views:** Test your layout scales in our responsive preview pane to ensure titles are readable on phone feeds.
`,
    faqs: [
      { question: 'What is the best size for a YouTube thumbnail?', answer: 'YouTube recommends an image resolution of 1280x720 pixels, with a minimum width of 640 pixels, in 16:9 aspect ratio.' },
      { question: 'Can I import PNG cutouts from the background remover?', answer: 'Yes. Use our Background Remover to create transparent PNG cutouts of yourself or products, and upload them inside the Thumbnail editor.' }
    ],
    relatedTools: ['/background-remover', '/watermark-remover']
  }
};
