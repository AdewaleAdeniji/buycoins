try{
const cachename = "site-static";

self.addEventListener('install',evt=>{
	console.log("service worker installed");
});
//activate service worker

self.addEventListener("activate",evt=>{
	console.log("service worker acivated");
});

//fetch
self.addEventListener('fetch',(evt)=>{
	// console.log(evt);
	evt.respondWith(
		caches.match(evt.request)
		.then((cacheRes)=>{
			return cacheRes  || fetch(evt.request).then((fetchRes)=>{
				return caches.open(cachename).then((cache)=>{
					cache.put(evt.request.url,fetchRes.clone());
					  
					return fetchRes;
				})
			})
			.catch((err)=>{
				console.log(err);
			})
		})
		);
});
}
catch(err){
	console.log(err);
}