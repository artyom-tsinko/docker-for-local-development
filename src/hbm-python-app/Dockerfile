# Use the official Python image as the base image
FROM python:3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the requirements file to the working directory
COPY requirements.txt ./

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (if applicable)
EXPOSE 8080

# Command to run the application
# CMD ["python", "simple_http_server.py"]
CMD ["python", "server.py"]
