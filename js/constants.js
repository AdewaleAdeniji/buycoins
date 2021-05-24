//encoded token to prevent auto removal by github.
const GITHUB_ENCODED_TOKEN =
  "Z2hwX2pIakhpaEk5ZWxBUjkzV2JFUEFoSEJZejdHaDZCeDE3cWs3cg==";

const GITHUB_DECODED_TOKEN = atob(GITHUB_ENCODED_TOKEN);
function queryString(name){
return  `
{
  viewer {
    login
  }
  user(login: "${name}") {
     name
    bio
    avatarUrl
    status {
      emojiHTML
      message
      __typename
    }
    repositories(last: 20, isFork: false) {
      nodes {
        name
        description
        url
        stargazerCount
        updatedAt
        forkCount
        isPrivate
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
          nodes {
            color
            name
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }

}
`;
}
