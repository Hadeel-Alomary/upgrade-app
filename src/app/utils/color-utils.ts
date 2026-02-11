export class ColorUtils{

    private static darkColorIndex:number = -1;
    private static darkColorsPalette = [
        '#684d60',
        '#4c5a87',
        '#ce9f45',
        '#748052',
        '#8b424d',
        '#060c18',
        '#00382f',
        '#5d1f62'
    ];

    static getRandomDarkColorFromPallete():string{
        ColorUtils.darkColorIndex += 1;
        ColorUtils.darkColorIndex %= ColorUtils.darkColorsPalette.length;
        return ColorUtils.darkColorsPalette[ColorUtils.darkColorIndex];
    }

    static generateRandomColor():string{
        // http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
        let randomR = Math.floor(Math.random() * (255 + 1)) ;
        let randomG = Math.floor(Math.random() * (255 + 1)) ;
        let randomB = Math.floor(Math.random() * (255 + 1)) ;

        return "#" + ColorUtils.componentToHex(randomR) + ColorUtils.componentToHex(randomG) + ColorUtils.componentToHex(randomB);
    }
       
    static generateDarkRandomColor():string{
        
        var color:string; 

        while(true) {

            color = ColorUtils.generateRandomColor();
            
            //http://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
            var c:string = color.substring(1);      // strip #
            var rgb = parseInt(c, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >>  8) & 0xff;  // extract green
            var b = (rgb >>  0) & 0xff;  // extract blue
            
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
            
            if (luma < 75) {
                break;
            }
            
        }
        
        return color;

    }

    // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    private static componentToHex(c:number){
        let hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
}
