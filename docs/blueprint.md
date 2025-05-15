# **App Name**: GeoGuessAI

## Core Features:

- Image Upload: Implement a drag-and-drop interface for easy image uploading. Users can drag images directly onto the designated area or use a file picker.
- Loading Animation: Display a loading spinner after the image is uploaded, indicating that the AI is processing the image.
- AI Location Analysis: Analyze the uploaded image using BLIP-2 or GPT-4 Vision to identify the location depicted in the background, as well as generate a descriptive caption of the picture. The reasoning behind the location guess is provided using an LLM tool.
- Results Display: Present the AI's location guess prominently, along with the generated caption, after the image has been analyzed. Make sure to display the certainty or confidence with which the AI suggests its location guess.
- Image Search Integration: Include links to Google Image Search for similar images or landmarks, helping users explore the location further.

## Style Guidelines:

- Primary color: Use a clean, neutral background (e.g., #F9FAFB) to emphasize the images and results.
- Accent color: Use Teal (#008080) to highlight interactive elements and calls to action.
- Clean and readable sans-serif fonts to ensure easy readability.
- Use a simple, single-column layout to focus the user's attention on the image and the AI's analysis.
- Use subtle animations for the loading spinner and transitions between the upload and results pages to enhance the user experience.
- Use clear and recognizable icons for upload prompts, search links, and any interactive elements.