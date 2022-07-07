const LoopMode = {
  once: THREE.LoopOnce,
  repeat: THREE.LoopRepeat,
  pingpong: THREE.LoopPingPong,
};

/**
 * animation-mixer
 *
 * Player for animation clips. Intended to be compatible with any model format that supports
 * skeletal or morph animations through THREE.AnimationMixer.
 * See: https://threejs.org/docs/?q=animation#Reference/Animation/AnimationMixer
 */
module.exports = AFRAME.registerComponent("animation-mixer", {
  schema: {
    clip: { default: "*" },
    duration: { default: 0 },
    clampWhenFinished: { default: false, type: "boolean" },
    crossFadeDuration: { default: 0 },
    loop: { default: "repeat", oneOf: Object.keys(LoopMode) },
    repetitions: { default: Infinity, min: 0 },
    timeScale: { default: 1 },
    startFrame: { default: 0 },
  },

  init: function () {
    /** @type {THREE.Mesh} */
    this.model = null;
    /** @type {THREE.AnimationMixer} */
    this.mixer = null;
    /** @type {Array<THREE.AnimationAction>} */
    this.activeActions = [];

    const model = this.el.getObject3D("mesh");

    if (model) {
      this.load(model);
    } else {
      this.el.addEventListener("model-loaded", (e) => {
        this.load(e.detail.model);
      });
    }
  },

  load: function (model) {
    const el = this.el;
    var count = 0;
    var text = document.querySelector('a-text');
    this.model = model;
    this.mixer = new THREE.AnimationMixer(model);
    this.mixer.addEventListener("loop", (e) => {
      el.emit("animation-loop", { action: e.action, loopDelta: e.loopDelta });
      if(e.action._clip.name == "SchraubeEnd") {
        count++;
        text.setAttribute("value", "Produziert: " + count)
        console.log("COUNT "+count);
        
      }
      console.log(e.action._clip.name);
    });
    this.mixer.addEventListener("finished", (e) => {
      el.emit("animation-finished", {
        action: e.action,
        direction: e.direction,
      });
      console.log("finished");
    });
    if (this.data.clip) this.update({});
  },

  remove: function () {
    console.log("remove");
    if (this.mixer) this.mixer.stopAllAction();
  },

  update: function (prevData) {
    console.log("update");
    if (!prevData) return;
    console.log("update 2nd");

    const data = this.data;
    const changes = AFRAME.utils.diff(data, prevData);

    // If selected clips have changed, restart animation.
    if ("clip" in changes) {
      this.stopAction();
      if (data.clip) this.playAction();
      return;
    }
    console.log("update mid");
    // Otherwise, modify running actions.
    this.activeActions.forEach((action) => {
      console.log("modify running actions");
      if ("duration" in changes && data.duration) {
        action.setDuration(data.duration);
        console.log("durations end");
      }
      if ("clampWhenFinished" in changes) {
        action.clampWhenFinished = data.clampWhenFinished;
        console.log("clamp end");
      }
      if ("loop" in changes || "repetitions" in changes) {
        action.setLoop(LoopMode[data.loop], data.repetitions);
        console.log("loop & repetitions end");
      }
      if ("timeScale" in changes) {
        action.setEffectiveTimeScale(data.timeScale);
        console.log("time scale end");
      }
    });
    console.log("update end");
  },

  stopAction: function () {
    const data = this.data;
    for (let i = 0; i < this.activeActions.length; i++) {
      data.crossFadeDuration
        ? this.activeActions[i].fadeOut(data.crossFadeDuration)
        : this.activeActions[i].stop();
    }
    this.activeActions.length = 0;
  },

  playAction: function () {
    console.log("playAction");
    if (!this.mixer) return;

    const model = this.model,
      data = this.data,
      clips = model.animations || (model.geometry || {}).animations || [];

    if (!clips.length) return;

    const re = wildcardToRegExp(data.clip);

    for (let clip, i = 0; (clip = clips[i]); i++) {
      if (clip.name.match(re)) {
        const action = this.mixer.clipAction(clip, model);
        
        action.enabled = true;
        action.clampWhenFinished = data.clampWhenFinished;
        if (data.duration) action.setDuration(data.duration);
        if (data.timeScale !== 1) action.setEffectiveTimeScale(data.timeScale);
        action
          .setLoop(LoopMode[data.loop], data.repetitions)
          .fadeIn(data.crossFadeDuration)
          .play();
        this.activeActions.push(action);
        this.mixer.setTime(data.startFrame / 1000);
      }
    }
    console.log("play end");
  },

  tick: function (t, dt) {
    if (this.mixer && !isNaN(dt)) this.mixer.update(dt / 1000);
    // console.log("tick");
  },
});

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 */
function wildcardToRegExp(s) {
  return new RegExp("^" + s.split(/\*+/).map(regExpEscape).join(".*") + "$");
}

/**
 * RegExp-escapes all characters in the given string.
 */
function regExpEscape(s) {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
}
