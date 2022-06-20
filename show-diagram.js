AFRAME.registerComponent("show-diagram", {
  init: function () {
    let el = this.el;
    let diagram = document.querySelector("a-image");
    this.showdiagram = function (e) {
      diagram.setAttribute("visible", "true");
      alert("clicked");
    };
    this.el.addEventListener("click", this.showdiagram);
  },
  remove: function () {
    this.el.removeEventListener("click", this.showdiagram);
  },
});
