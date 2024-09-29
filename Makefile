# Command to install dependencies
install:
	echo "Installing dependencies..."
	npm install

# Command to run the web application locally
run:
	echo "Starting the React app..."
	npm start

# Optional clean command to remove node_modules
clean:
	echo "Cleaning up..."
	rm -rf node_modules

# Command to build the project (optional)
build:
	echo "Building the React app..."
	npm run build
