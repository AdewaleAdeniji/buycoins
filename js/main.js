// private scope

const gitHubDetailsNode = gitHubDOM.getAllNode(".github_details");

function fetchAndMapRepos(querystring,username) {
  return new Promise((loadedFn) => {
    informError('Searching Repositories.....');
    fetch("https://api.github.com/graphql", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      referrerPolicy: "no-referrer",
      headers: {
        "Content-Type": "application/json",
        authorization: `token ${GITHUB_DECODED_TOKEN} `,
      },
      body: JSON.stringify({
        query:querystring,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(({ data }) => {
        loadedFn(data);

        const { user } = data;
        user['username'] = username;
        if(user.status==null){
          var status = {
            "emojiHTML":"",
            "message":"Github Account"
          }
          user['status'] = status;
        }
        mapUserData(user);
        informError('Repositories Found. Processing Data');
        //show latest repos first
        [...user.repositories.nodes].reverse().forEach((repo) => {
          mapRepoData(repo);
        });
        togglemodal();
      });
  });
}

function animateRepoHeader() {
  const headerUserNode = gitHubDOM.getNode(".repo_app_header-user");

  window.addEventListener("scroll", (e) => {
    if (window.scrollY >= 370) {
      headerUserNode.classList.remove("hide");
    } else {
      headerUserNode.classList.add("hide");
    }
  });
}

function initMiniModals() {
  Array.from(gitHubDetailsNode).forEach((currentTarget) => {
    const detailsNode = currentTarget.querySelector("details");

    currentTarget.addEventListener("blur", () => {
      setTimeout(() => {
        detailsNode.open = false;
        detailsNode.style.pointerEvents = "none";
      }, 200);
    });

    currentTarget.addEventListener("focus", () => {
      detailsNode.open = true;
      detailsNode.style.pointerEvents = "unset";
    });
  });
}

function initHamBurgerMenu() {
  const hamBurgerButton = gitHubDOM.getNode(".js_hamburger_btn");
  const mobileLinks = gitHubDOM.getNode(".mbl_links_container");

  hamBurgerButton.addEventListener("click", () => {
    const mobileLinksClassList = mobileLinks.classList;
    const mobileLinksClassListArray = Array.from(mobileLinksClassList);

    if (mobileLinksClassListArray.includes("is_open")) {
      mobileLinksClassList.remove("is_open");
    } else {
      mobileLinksClassList.add("is_open");
    }
  });
}

const fetchAndMapReposAction = async (name) => {
  const GITHUB_QUERY = queryString(name);
  const response = await fetchAndMapRepos(GITHUB_QUERY,name);
  const hasLoadedRepos = "viewer" in response;
  const repoContainerNode = gitHubDOM.getNode(".repo_container");
  const pageLoaderNode = gitHubDOM.getNode(".app_page_loader");

  pageLoaderNode.classList.add("hide");
  repoContainerNode.classList.remove("hide");

  animateRepoHeader();
};
function informError(error){
  document.getElementById('errormessage').innerHTML=error;
}
document.getElementById('searchform').addEventListener('submit',function(e){
  e.preventDefault();
  var username = document.getElementById('gitusername').value;
  processSearch(username);
  
 // const GITHUB_QUERY = queryString('name');
});
document.getElementById('gitsearch').addEventListener('submit',function(e){
  e.preventDefault();
  var username = document.getElementById('githubusername').value;
  togglemodal();
  processSearch(username);
  
 // const GITHUB_QUERY = queryString('name');
});
var hinted = false;
function showHint(){
  if(!hinted){
    toast('Welcome to GitFinder, You can hit the "/" key to search for another username. Cheers! ');
    hinted = true;
  }
}
function toast(text){
  document.getElementById('toast').style.display='block';
  document.getElementById('toastext').innerHTML=text;
}
document.getElementById('closebtn').addEventListener('click',function(){
  closetoast();
})
function closetoast(){
  document.getElementById('toast').style.display='none';
}
function processSearch(username){
  // togglemodal();
  document.getElementById('gitusername').value=username;
  if(username.trim()==""){
    informError('Empty Username');
  }
  else {
    informError("Loading.....");
     fetch(`//api.github.com/users/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((data)=>{
        informError('User Validation Complete... Proceeding to find Repositories');
        
        fetchAndMapReposAction(username);
        document.getElementById('reposcontainer').innerHTML='';
        showHint();
      })
      .catch((err)=>{
        // console.log(err);
        informError(username+" is not a valid Github Username");
      })

  }
}
var modalstate = true;
function togglemodal(){
  var display = '';
  if(modalstate){
    display='none';
  }
  else {
    display='flex';
  }
  modalstate = !modalstate;
  document.getElementById('modal').style.display=display;
}
document.onkeypress = function (e) {
    
  // use e.keyCode
  if(!modalstate){
    if(e.key=='/'){
      e.key='';
      document.getElementById('githubusername').focus();
    }
  }
};
document.getElementById('githubusername').addEventListener('input', (event) => {
  let inp = document.getElementById('githubusername').value;

  document.getElementById('githubusername').value=inp.replace(/\W/g, '');
  
});
initMiniModals();
initHamBurgerMenu();
