# a short script to compress all of the images in folders.
import os
from pathlib import Path
from PIL import Image
# ---- Config ----
# folder relative to script where images are
TARGET_DIRECTORY = str(Path(__file__).resolve().parent.parent / 'assets' / 'albumart') 
# TARGET_DIRECTORY = '././assets/albumart'
# TODO: update target directory

# print(TARGET_DIRECTORY.exists())

# Target file size limit in kb (eg 200kb)
TARGET_SIZE_KB = 200

VALID_EXTENSIONS = ('.jpg','.png')

def compress_in_place(file_path, target_size_kb):
	original_size = os.path.getsize(file_path) / 1024

	# skip if already small enough
	if original_size <= target_size_kb:
		print(f"Skipping {file_path} (already {original_size:.1f} KB)")
		return
	try:
		with Image.open(file_path) as img:
			img.load()
			# determine format
			img_format = img.format if img.format else "JPEG"
			# Convert RGBA/Palette
			if img_format == "JPEG" and img.mode in ("RGBA","P"):
				img = img.convert("RGB")
		# dynamic optimization loop (lower quality until target size is met)
		quality = 90
		while quality >= 20:
			# save temp
			temp_path = file_path + ".tmp"
			# PNG specific
			if img_format == "PNG":
				img.save(temp_path, format=img_format, optimize=True)
				# if optimize isn't enough, convert to other
				new_size = os.path.getsize(temp_path) / 1024
				if new_size > target_size_kb:
					print(f"PNG {file_path} can't reach {target_size_kb}KB via lossless compression. converting to webp...")
					img_format = 'WEBP'
					continue
			else:
				# jpeg and webp support quality tuning
				img.save(temp_path, format=img_format, optimize=True, quality=quality)
			new_size = os.path.getsize(temp_path) / 1024
			# check quality again
			if new_size <= target_size_kb or quality == 20:
				os.replace(temp_path, file_path)
				print(f"Compressed {file_path}: {original_size:.1f} KB -> {new_size:.1f}KB (Quality: {quality})")
				break
			quality -= 5 
			# lower quality and try again
			os.remove(temp_path)

	except Exception as e:
		print(f"Error processing {file_path}: {e}")

def main():
	print(f"Scanning dir: '{TARGET_DIRECTORY}' for images...")
	if not os.path.exists(TARGET_DIRECTORY):
		print(f"The directory '{TARGET_DIRECTORY}' does not exist")
		return
	count = 0
	for root, _, files in os.walk(TARGET_DIRECTORY):
		for file in files:
			if file.lower().endswith(VALID_EXTENSIONS):
				file_path = os.path.join(root, file)
				compress_in_place(file_path, TARGET_SIZE_KB)
				count += 1
		print(f"\nFinished processing {count} image file(s).")
if __name__ == "__main__":
	main()
