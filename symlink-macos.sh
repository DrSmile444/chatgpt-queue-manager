# Remove the existing file (be cautious as this deletes the file)
echo "Remove main.js file"
rm ~/.chatgpt/scripts/main.js

# Now create the symlink
echo "Create symlink"
ln -s $(pwd)/src/main.js ~/.chatgpt/scripts/main.js

echo "Done! Reload ChatGPT application with Cmd + Shift + R."
