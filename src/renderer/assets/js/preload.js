export function show_loading(destroy_on_loaded=true) {
    let preload_container = document.createElement('div');
    preload_container.className = 'preload_container';
    let preload_content = document.createElement('div');
    preload_content.className = 'spinner';
    preload_container.appendChild(preload_content);
    let first = document.body.firstChild;
    document.body.insertBefore(preload_container, first);
    function loaded(){
        preload_container.remove();
        window.removeEventListener("load", loaded, false);
    }
    if(destroy_on_loaded) window.addEventListener("load", loaded, false);
}

show_loading();