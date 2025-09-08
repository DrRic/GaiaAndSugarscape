/**
 * A double-buffered canvas designed for efficient rendering of grid-based
 * cellular automata and agent-based models.
 * 
 * Uses an off-screen canvas for drawing operations to prevent flickering
 * and provide smooth animation when updated to a visible canvas.
 */
class CACanvas {
    /**
     * Creates a new CACanvas instance.
     * @param {number} size - The number of cells along one dimension (creates a size x size grid).
     * @param {number} [cSize=20] - The pixel size of an individual cell. Defaults to 20.
     */
    constructor(size, cSize = 20) {
        /** @member {number} The grid dimension (size x size). */
        this.size = size;
        /** @member {number} The pixel size of an individual cell. */
        this.cSize = cSize;
        
        // Create an off-screen canvas buffer for all drawing operations
        /** @member {HTMLCanvasElement} The off-screen drawing buffer. */
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.size * this.cSize;
        this.buffer.height = this.size * this.cSize;
        
        /** @member {CanvasRenderingContext2D} The drawing context for the buffer. */
        this.ctx = this.buffer.getContext("2d");
    }

    /**
     * Draws a cell and optionally an agent circle on the canvas buffer.
     * 
     * @param {number} x - The x-coordinate of the cell (grid coordinates, not pixels).
     * @param {number} y - The y-coordinate of the cell (grid coordinates, not pixels).
     * @param {string} cellColor - The CSS color string for the cell background.
     * @param {boolean} [circle=false] - If true, draws a circle representing an agent.
     * @param {string} [circleColor="#000000"] - The CSS color string for the agent circle.
     */
    draw(x, y, cellColor, circle = false, circleColor = "#000000") {
        // Draw the cell background (the patch)
        this.ctx.beginPath();
        this.ctx.rect(x * this.cSize, y * this.cSize, this.cSize, this.cSize);
        this.ctx.fillStyle = cellColor;
        this.ctx.fill();

        // If requested, draw an agent as a centered circle on top of the cell
        if (circle === true) {
            const offset = Math.floor(this.cSize / 2); // Calculate center of the cell
            
            // Draw the filled circle
            this.ctx.beginPath();
            this.ctx.arc(x * this.cSize + offset, y * this.cSize + offset, offset - 1, 0, 2 * Math.PI);
            this.ctx.fillStyle = circleColor;
            this.ctx.fill();
            
            // Add a black outline to the circle for better visibility
            this.ctx.strokeStyle = '#000000';
            this.ctx.stroke();
        }
        return this.cSize
    }

    /**
     * Draws a line between the centers of two cells. Useful for visualizing
     * connections between agents (e.g., trade routes, social links).
     * 
     * @param {number} x1 - The x-coordinate of the starting cell.
     * @param {number} y1 - The y-coordinate of the starting cell.
     * @param {number} x2 - The x-coordinate of the ending cell.
     * @param {number} y2 - The y-coordinate of the ending cell.
     */
    drawLine(x1, y1, x2, y2) {
        const offset = Math.floor(this.cSize / 2); // Calculate center point of any cell
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#000000'; // Draw black lines
        // Move to the center of the first cell
        this.ctx.moveTo(x1 * this.cSize + offset, y1 * this.cSize + offset);
        // Draw a line to the center of the second cell
        this.ctx.lineTo(x2 * this.cSize + offset, y2 * this.cSize + offset);
        this.ctx.stroke();
    }

    /**
     * Renders the current buffer to a visible canvas element on the page.
     * This method implements the double-buffering technique for smooth updates.
     * 
     * @param {string} canvasID - The HTML id attribute of the target canvas element.
     */
    update(canvasID) {
        const visible_canvas = document.getElementById(canvasID);
        const vctx = visible_canvas.getContext("2d");
        
        // Draw the entire off-screen buffer to the visible canvas
        // This single operation prevents flickering and ensures a smooth visual update
        vctx.drawImage(
            this.buffer, 
            0, 0, this.ctx.canvas.width, this.ctx.canvas.height, // Source dimensions (the entire buffer)
            0, 0, vctx.canvas.width, vctx.canvas.height          // Destination dimensions (the entire visible canvas)
        );
        return vctx.canvas.width
    }
}