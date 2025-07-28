export const mediaQuery = window.matchMedia("(max-width: 1100px)");

/** Handles responsive design changes */
export function handleMediaQueryChange(e) {
  if (e.matches){
    document.getElementById('responsive-small-add').classList.remove('d-none');
    document.getElementById('right-section').classList.forEach(e => { 
      if(e == 'slide-in'){
        document.getElementById('responsive-small-add').classList.add('d-none');
      }
    });
  }
  else
    document.getElementById('responsive-small-add').classList.add('d-none');
}