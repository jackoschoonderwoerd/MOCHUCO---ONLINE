import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
    selector: 'app-audio',
    templateUrl: './audio.component.html',
    styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit {

    constructor(
        private itemService: ItemService
    ) { }
    // @Input() audioUrl: string;
    audioUrl: string;
    audioPlayer = new Audio;
    percentage: number = 0;
    isPlaying: boolean;
    minimumVolumeReached: boolean = false;
    maximumVolumeReached: boolean = false;
    panelOpenState = false;
    @Output() audioPanelOpen = new EventEmitter<boolean>();



    ngOnInit(): void {
        this.itemService.audioUrl$.subscribe((audioUrl: string) => {
            this.audioUrl = audioUrl;
            console.log(this.audioUrl)
            this.initAudio();
            this.isPlaying = false;
        })
    }
    initAudio() {
        this.audioPlayer.src = this.audioUrl;
        let duration: number = 0
        this.audioPlayer.addEventListener('loadeddata', (event: any) => {
            duration = event.path[0].duration
        })
        this.audioPlayer.addEventListener('timeupdate', (event: any) => {
            const currentTime = event.path[0].currentTime
            this.percentage = Math.round((currentTime / duration) * 100);
        });
        this.audioPlayer.addEventListener('ended', (event) => {
            this.isPlaying = false;
            this.percentage = 0;
        });
        if (this.audioPlayer.volume === 1) {
            this.maximumVolumeReached = true;
        }
        console.log(this.audioPlayer.volume);
    }
    onPlayPause() {

        if (!this.isPlaying) {
            this.audioPanelOpen.emit(true);
            this.isPlaying = true;
            this.audioPlayer.play()
        } else {

            this.audioPlayer.pause();
            this.audioPanelOpen.emit(false);
            this.isPlaying = false;
        }

    }
    onReplay() {
        this.audioPlayer.src = this.audioUrl;
        this.audioPlayer.play();
        this.isPlaying = true;
    }
    adjustVolume(status: string) {
        if (status === 'increase') {
            if (this.audioPlayer.volume <= 0.9) {
                this.audioPlayer.volume += 0.1;
            }
        } else if (status === 'decrease') {
            if (this.audioPlayer.volume >= 0.1) {
                this.audioPlayer.volume -= 0.1;
            }
        }
        // console.log(this.audioPlayer.volume);
    }

}
