import {Subject} from 'rxjs/Rx';
import {Injectable} from '@angular/core';

declare var YT;

export type PlayerEvent = {Event: string, Data: number};

@Injectable()
export class PlayerService {

    private playerVars = {
        controls: 0,
        autoplay: 1,
        fs:0,
        iv_load_policy:3,
        modestbranding: 1,
        rel: 0,
        disablekb: 1,
        enablejsapi: 1,
        start: 0,
        events: {
            'onStateChange': this.onPlayerStateChange
        }
    }
    private playerEvents: Subject<PlayerEvent> = new Subject<PlayerEvent>();
    private player;
    private playerInfo;
    private novid = true;

    constructor() {
        let tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window['onYouTubeIframeAPIReady'] = () => {
            this.player = new YT.Player('player', this.playerVars);
            this.player.stopVideo = () => {};
            this.player.pauseVideo = () => {};
            this.player.seekTo = () => {};
            this.player.setLoop = () => {};
        }
    }

    observe(): Subject<PlayerEvent> {
        return this.playerEvents;
    }

    onPlayerStateChange(event) {
        if (event.data === 2) {
            this.player.playVideo();
        } else {
            this.playerEvents.next({Event: 'stateChange', Data: event.data});
        }
    }

    playVideo(video, startSeconds) {
        if (video) {
            this.novid = false;
            if(this.player && this.player.clearVideo){
                this.player.clearVideo();
                this.player.cueVideoById(video.Info.ID);
                this.playerVars.start = startSeconds || 0;
                this.player.playVideo();
            } else{
                this.playerVars.start = startSeconds || 0;
                this.playerInfo = video.Info;
            }
        } else {
            this.novid = true;
            this.playerInfo = undefined;
            if (this.player && this.player.stopVideo){
                this.player.stopVideo();
            }
        }
    }

    getCurrentTime() {
        return this.player.getCurrentTime();
    }

    setVolume(volume: number) {

    }

    setMuted(muted: boolean) {
        muted ? this.player.mute() : this.player.unMute();
    }

    hasVideo(): boolean {
        return !this.novid;
    }




    
}
