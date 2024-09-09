document.addEventListener("DOMContentLoaded", () => {
    // Select the canvas element and get its 2D drawing context
    const canvas = document.getElementById('particleCanvas');
    
    // Check if the canvas was found
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Get the 2D drawing context from the canvas
    const ctx = canvas.getContext('2d');
    
    // Check if the 2D context was successfully retrieved
    if (!ctx) {
        console.error('2D context not found!');
        return;
    }

    // Configuration object for controlling particle behavior and appearance
    const config = {
        particleCount: 100,           // Number of particles to display
        maxDistance: 120,             // Maximum distance between particles to draw a line
        particleSpeed: 1,             // Speed of particle movement
        minParticleSize: 1,           // Minimum size of particles
        maxParticleSize: 4,           // Maximum size of particles
        particleColor: 'white',       // Color of the particles
        edgeColor: 'rgba(255, 255, 255, 0.5)', // Color of lines (edges) between particles
        mouseRadius: 150              // Radius around the mouse where particles will be repelled
    };

    // Array to hold all particle objects
    const particles = [];
    
    // Object to track mouse position and repulsion radius
    const mouse = {
        x: null,                     // Mouse X coordinate
        y: null,                     // Mouse Y coordinate
        radius: config.mouseRadius   // Radius within which particles are repelled
    };

    // Set the canvas dimensions to match the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class to handle particle properties and behaviors
    class Particle {
        constructor() {
            // Initialize particle position to a random location within the canvas
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Initialize particle velocity to a random value, scaled by particleSpeed
            this.vx = (Math.random() * 2 - 1) * config.particleSpeed;
            this.vy = (Math.random() * 2 - 1) * config.particleSpeed;
            
            // Initialize particle size to a random value within the specified size range
            this.size = Math.random() * (config.maxParticleSize - config.minParticleSize) + config.minParticleSize;
        }

        // Update the particle's position based on its velocity
        update() {
            this.x += this.vx;  // Update X position
            this.y += this.vy;  // Update Y position

            // Bounce the particle off the edges of the canvas
            if (this.x > canvas.width || this.x < 0) this.vx *= -1;
            if (this.y > canvas.height || this.y < 0) this.vy *= -1;

            // Calculate distance between the particle and the mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Repel the particle if it is within the mouse radius
            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);  // Calculate angle between particle and mouse
                const repelForce = (mouse.radius - distance) / mouse.radius;  // Calculate repulsion force
                this.vx -= repelForce * Math.cos(angle);  // Adjust X velocity based on repulsion
                this.vy -= repelForce * Math.sin(angle);  // Adjust Y velocity based on repulsion
            }
        }

        // Draw the particle on the canvas
        draw() {
            ctx.beginPath();  // Start a new drawing path
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);  // Draw a circle (particle)
            ctx.fillStyle = config.particleColor;  // Set the particle color
            ctx.fill();  // Fill the particle with the specified color
        }
    }

    // Function to draw lines between particles that are close to each other
    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                // Calculate distance between two particles
                let dist = Math.sqrt(
                    Math.pow(particles[a].x - particles[b].x, 2) +
                    Math.pow(particles[a].y - particles[b].y, 2)
                );

                // Draw a line if the distance is less than maxDistance
                if (dist < config.maxDistance) {
                    ctx.beginPath();  // Start a new drawing path
                    // Set the line color with dynamic opacity based on distance
                    ctx.strokeStyle = config.edgeColor.replace('0.5', `${1 - dist / config.maxDistance}`);
                    ctx.lineWidth = 1;  // Set the line width
                    ctx.moveTo(particles[a].x, particles[a].y);  // Move to the start of the line
                    ctx.lineTo(particles[b].x, particles[b].y);  // Draw a line to the end of the line
                    ctx.stroke();  // Render the line
                    ctx.closePath();  // Close the drawing path
                }
            }
        }
    }

    // Function to animate the particles
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas for the next frame

        particles.forEach(particle => {
            particle.update();  // Update the particle's position
            particle.draw();    // Draw the particle on the canvas
        });

        connectParticles();  // Draw lines connecting close particles

        requestAnimationFrame(animate);  // Request the next animation frame
    }

    // Initialize the particle objects
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }

    animate();  // Start the animation loop

    // Handle window resize to adjust canvas size
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;  // Update canvas width
        canvas.height = window.innerHeight;  // Update canvas height
    });

    // Track mouse movement and update the mouse position
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;  // Update mouse X position
        mouse.y = event.y;  // Update mouse Y position
    });

    // Reset mouse position when the cursor leaves the canvas
    window.addEventListener('mouseout', () => {
        mouse.x = null;  // Clear mouse X position
        mouse.y = null;  // Clear mouse Y position
    });
});
