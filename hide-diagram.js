AFRAME.registerComponent("hide-diagram", {
    init: function () {
      let el = this.el;
      let diagram = document.querySelector("a-image");
      let hideButton = document.querySelector("#hide");
      let showButton = document.querySelector("#show");
  
      this.hidediagram = function (e) {
        diagram.setAttribute("visible", "false");
        showButton.setAttribute("visible", "true");
        hideButton.setAttribute("visible", "false");
      };
      this.el.addEventListener("click", this.hidediagram);
    },
    remove: function () {
      this.el.removeEventListener("click", this.hidediagram);
    },
  });