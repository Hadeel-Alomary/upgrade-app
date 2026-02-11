import {Injectable} from '@angular/core';


@Injectable()
export class DebugModeService {

    private debugStreamerUrl: string | null = null;

    public setDebugStreamerUrl(url: string | null) {
        this.debugStreamerUrl = url;
    }

    public getDebugStreamerUrl(): string | null {
        return `http://${this.debugStreamerUrl}:9006/streamhub/`;
    }

    public connectToDebugStreamer(): boolean {
        return this.debugStreamerUrl !== null;
    }
}
