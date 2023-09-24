import { song } from "../song";
import { CPlayer } from "./audio-player";
import { zzfx } from "./zzfx";

export class AudioManager {
  private started = false;
  private audio: HTMLAudioElement;
  private loaded: boolean;

  public prepare(): void {
    if (this.started) return;

    this.audio = document.createElement("audio");
    this.started = true;

    const player = new CPlayer();
    player.init(song);
    player.generate();
    this.loaded = false;

    const timer = setInterval(() => {
      if (this.loaded) return;
      this.loaded = player.generate() >= 1;
      if (this.loaded) {
        var wave = player.createWave();
        this.audio.src = URL.createObjectURL(
          new Blob([wave], { type: "audio/wav" }),
        );
        this.audio.loop = true;
        clearInterval(timer);
      }
    }, 5);
  }

  public play(): void {
    const timer = setInterval(() => {
      if (!this.loaded) return;
      this.audio.play();
      clearInterval(timer);
    }, 5);

    // restart early for better looping
    // this.audio.addEventListener('timeupdate', () => {
    //     if(this.audio.currentTime > this.audio.duration - 0.21) {
    //         this.audio.currentTime = 0;
    //         this.audio.play();
    //     }
    // });
  }

  public deadEnd(): void {
    zzfx(
      ...[
        1.5,
        ,
        157,
        0.16,
        ,
        0,
        ,
        0.35,
        -24,
        28,
        ,
        ,
        ,
        0.1,
        ,
        0.6,
        ,
        0.19,
        0.01,
      ],
    );
  }

  public move(): void {
    zzfx(
      ...[, , 759, 0.01, , 0.01, 1, 0.97, 15, , , , , , 3.1, , , 0.76, 0.04],
    );
  }

  public chest(): void {
    zzfx(
      ...[
        0.5,
        ,
        392,
        0.06,
        0.22,
        0.5,
        1,
        1.85,
        -0.1,
        -0.9,
        61,
        0.05,
        0.07,
        ,
        ,
        0.1,
        ,
        0.96,
        0.12,
      ],
    );
  }

  public win(): void {
    zzfx(
      ...[
        0.5,
        ,
        146,
        0.04,
        0.23,
        0.46,
        ,
        0.56,
        ,
        -3.7,
        658,
        0.02,
        0.15,
        0.1,
        ,
        ,
        ,
        0.82,
        0.13,
        0.2,
      ],
    );
  }

  public explode(): void {
    zzfx(
      ...[
        1.5,
        ,
        785,
        0.01,
        0.1,
        0.54,
        4,
        2.66,
        ,
        ,
        ,
        ,
        ,
        0.9,
        ,
        0.5,
        0.38,
        0.34,
        0.11,
        0.14,
      ],
    );
  }

  public open(): void {
    zzfx(
      ...[
        0.4,
        ,
        22,
        0.08,
        0.22,
        0.02,
        1,
        0.52,
        -4.2,
        -9.8,
        ,
        ,
        0.14,
        ,
        -18,
        0.2,
        ,
        ,
        0.05,
      ],
    );
  }

  public lose(): void {
    zzfx(
      ...[
        1.5,
        ,
        430,
        0.02,
        0.12,
        0.5,
        ,
        0.89,
        ,
        -3.6,
        -133,
        0.07,
        0.13,
        ,
        ,
        0.1,
        ,
        0.83,
        0.23,
        0.26,
      ],
    );
  }

  public frog(): void {
    zzfx(
      ...[
        0.5,
        ,
        160,
        0.03,
        0.03,
        0.02,
        ,
        1.52,
        -23,
        93,
        662,
        0.02,
        ,
        ,
        ,
        0.1,
        ,
        ,
        0.07,
        0.01,
      ],
    );
  }

  public thud(): void {
    zzfx(
      ...[0.7, , 1305, , , 0.03, 1, 0.75, , 23, 694, 0.01, , , 3.9, , , , 0.01],
    );
  }

  public click(): void {
    zzfx(
      ...[
        ,
        ,
        158,
        0.09,
        0.18,
        0.03,
        ,
        2.53,
        11,
        -58,
        63,
        0.02,
        0.01,
        0.5,
        ,
        ,
        ,
        0.16,
      ],
    );
  }

  public aja(): void {
    zzfx(
      ...[
        0.7,
        ,
        1496,
        0.09,
        0.09,
        0.01,
        3,
        0.14,
        ,
        ,
        -870,
        ,
        ,
        ,
        3.2,
        0.2,
        ,
        0.31,
        0.02,
      ],
    );
  }

  public pop(): void {
    zzfx(...[0.5, , 1368, 0.09, , 0, , 1.11, -76, 9.1, -490, , , , , , , 0.56]);
  }

  public pong(): void {
    zzfx(...[6, , 205, , 0.02, 0, , 1.03, , , , , , , , , 0.12, 0.32]);
  }

  public swoosh(): void {
    zzfx(
      ...[
        0.1,
        ,
        836,
        0.11,
        ,
        0,
        4,
        0.91,
        13,
        ,
        ,
        ,
        0.09,
        0.1,
        -39,
        ,
        ,
        0.06,
        0.07,
      ],
    );
  }

  public multi(): void {
    zzfx(
      ...[
        ,
        ,
        341,
        ,
        0.14,
        0.23,
        1,
        1.01,
        0.9,
        ,
        -132,
        0.03,
        ,
        0.1,
        ,
        0.1,
        ,
        0.52,
        0.22,
      ],
    );
  }

  public score(): void {
    zzfx(
      ...[
        ,
        ,
        103,
        0.04,
        0.11,
        0.43,
        1,
        0.77,
        ,
        ,
        57,
        0.19,
        0.05,
        ,
        ,
        0.1,
        ,
        0.68,
        0.24,
      ],
    );
  }

  public discard(): void {
    zzfx(
      ...[0.5, , 426, 0.01, , 0.05, , 2.54, 49, , 9, 0.1, , , , , , 0.46, 0.15],
    );
  }

  public heal(): void {
    zzfx(
      ...[
        ,
        ,
        193,
        0.04,
        0.27,
        0.42,
        1,
        1.71,
        2.8,
        4.9,
        ,
        ,
        0.1,
        0.2,
        ,
        0.1,
        ,
        0.55,
        0.27,
        0.47,
      ],
    );
  }

  public boom(): void {
    zzfx(
      ...[
        ,
        ,
        922,
        0.03,
        0.03,
        0.33,
        4,
        1.88,
        0.5,
        0.4,
        ,
        ,
        ,
        0.9,
        ,
        0.2,
        ,
        0.45,
        0.05,
      ],
    );
  }
}
