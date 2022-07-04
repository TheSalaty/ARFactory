AFRAME.registerComponent('show-diagram', {
  init: function(){
    let el = this.el;
    let hideButton = document.querySelector('#hide');
    let showButton = document.querySelector('#show');
    let diagram = document.querySelector('a-image');
    
    this.showdiagram = function(e){
      diagram.setAttribute('visible', 'true');
      showButton.setAttribute('visible', 'false');
      hideButton.setAttribute('visible', 'true');
    }
    this.el.addEventListener('click',this.showdiagram);
  },
    remove: function(){
      this.el.removeEventListener('click',this.showdiagram);
    }
})