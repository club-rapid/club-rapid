import axios from 'axios';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO_OWNER = 'club-rapid';
const REPO_NAME = 'club-rapid';
const FILE_PATH = 'public/users.json';

const githubApi = axios.create({
  baseURL: `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

export const getUsers = async () => {
  try {
    const response = await githubApi.get(`/${FILE_PATH}`);
    // GitHub API returns content as base64 string
    const content = atob(response.data.content);
    return {
      users: JSON.parse(content),
      sha: response.data.sha,
    };
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return { users: [], sha: null };
    }
    throw error;
  }
};

export const saveUser = async (newUser: any) => {
  const { users, sha } = await getUsers();
  
  // 학번 중복 체크 등 비즈니스 로직
  if (users.find((u: any) => u.studentId === newUser.studentId)) {
    throw new Error('이미 등록된 학번입니다.');
  }

  const updatedUsers = [...users, newUser];
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(updatedUsers, null, 2))));

  const response = await githubApi.put(`/${FILE_PATH}`, {
    message: `feat: add new user ${newUser.name}`,
    content,
    sha,
  });

  return response.data;
};
