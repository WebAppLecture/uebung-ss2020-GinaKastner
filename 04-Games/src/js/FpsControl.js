/**
 * Provides funtionality to reduce framerate from requestAnimationFrame's 60fps.
 * 
 * based on  markE's solution: https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
 */
export class FpsControl {

    set fps(fps) {
        this.fpsIntervall = 1000/fps;
        this.then = Date.now();
    }

    /**
     * Decides which frames are rendered to acchieve target framerate.
     * Call this function every frame.
     * 
     * @return boolean, true if current frame should be rendered 
     */
    get frameLock() {
        let now = Date.now(),
            elapsed = now - this.then;

        if(elapsed > this.fpsIntervall) {
            this.then = now - (elapsed % this.fpsIntervall);
            return false;
        }
        return true;
    }
}