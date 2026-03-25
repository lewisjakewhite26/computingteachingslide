import cv2
import os
import sys

video_path = r"C:\Users\lewis\Downloads\animate.mp4"
output_dir = "frames"

os.makedirs(output_dir, exist_ok=True)

vidcap = cv2.VideoCapture(video_path)
if not vidcap.isOpened():
    print(f"Error: Could not open video at {video_path}")
    sys.exit(1)

success, image = vidcap.read()
count = 0

print("Starting frame extraction...")

while success:
    # Resize to 1080p width if larger to optimize web loading performance
    height, width = image.shape[:2]
    if width > 1920:
        ratio = 1920 / width
        image = cv2.resize(image, (1920, int(height * ratio)))
        
    frame_name = os.path.join(output_dir, f"frame_{count:03d}.jpg")
    cv2.imwrite(frame_name, image, [int(cv2.IMWRITE_JPEG_QUALITY), 65]) # 65% quality for lightweight loading
    success, image = vidcap.read()
    count += 1
    
    if count % 50 == 0:
        print(f"Extracted {count} frames...")

print(f"Extraction complete. {count} frames saved to {output_dir}/")
