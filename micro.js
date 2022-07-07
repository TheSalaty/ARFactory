
const activateMicro = ()=>{
console.log('col')
AFRAME.registerComponent("micro", {
  init: function () {
    let el = this.el;
    
    this.micro = function (e) {
      var audioContext = new AudioContext();
      stream.getAudioTracks()[0].enabled = true;
    };
    this.el.addEventListener("click", this.micro);
  },
  remove: function () {
    this.el.removeEventListener("click", this.micro);
  },
});

}