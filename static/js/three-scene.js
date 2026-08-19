// Simple Three.js scene: floating shapes with mouse parallax
(function(){
  const canvas = document.getElementById('three-canvas');
  if(!canvas) return;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40,1,0.1,1000);
  camera.position.z = 6;

  const light = new THREE.PointLight(0xffffff,1);
  light.position.set(5,5,5);
  scene.add(light);

  const group = new THREE.Group();
  scene.add(group);

  // Floating boxes representing services
  const colors = [0xff0066,0x7c3aed,0x06b6d4,0xffb86b];
  for(let i=0;i<8;i++){
    const geo = new THREE.BoxGeometry(1,0.6,0.2);
    const mat = new THREE.MeshStandardMaterial({color:colors[i%colors.length],emissive:colors[i%colors.length],emissiveIntensity:0.06,metalness:0.6,roughness:0.2});
    const m = new THREE.Mesh(geo,mat);
    m.position.set((Math.random()-0.5)*6,(Math.random()-0.5)*3,(Math.random()-0.5)*4);
    m.rotation.set(Math.random(),Math.random(),Math.random());
    group.add(m);
  }

  function resize(){
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    renderer.setSize(w,h,true);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  function animate(time){
    time *= 0.001;
    group.children.forEach((c,i)=>{
      c.rotation.x += 0.002 + i*0.0003;
      c.rotation.y += 0.003 + i*0.0002;
      c.position.y += Math.sin(time + i)*0.0008;
    })
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }

  let mouseX=0,mouseY=0;
  document.addEventListener('mousemove',(e)=>{
    const r = canvas.getBoundingClientRect();
    mouseX = (e.clientX - r.left)/r.width - 0.5;
    mouseY = (e.clientY - r.top)/r.height - 0.5;
    group.rotation.y = mouseX*0.6;
    group.rotation.x = -mouseY*0.6;
  })

  // Mobile performance fallback: if device is touch, reduce objects
  if('ontouchstart' in window || navigator.userAgent.match(/Mobi/)){
    while(group.children.length>4) group.remove(group.children[0]);
  }

  // initial size
  function fit(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width; canvas.height = rect.height;
    resize();
  }
  window.addEventListener('resize', resize);
  // set a reasonable initial size
  canvas.style.width = '100%'; canvas.style.height = '420px';
  resize();
  requestAnimationFrame(animate);
})();
