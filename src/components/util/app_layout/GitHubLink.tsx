import { Tooltip } from 'antd';
import githubDarkIcon from '../../../assets/github-mark-white.svg';
import githubLightIcon from '../../../assets/github-mark.svg';

type Props = {
  isDarkMode: boolean;
  githubUrl: string;
};

/**
 * アイコンで表現されたGitHubへのリンク
 */
export function GitHubLink({ githubUrl, isDarkMode }: Props) {
  return (
    <Tooltip title="View on GitHub" placement="bottom">
      <a href={githubUrl} target="_blank">
        <div
          style={{
            height: '64px',
            marginLeft: '10px',
            marginRight: '10px',
          }}
        >
          <img
            src={isDarkMode ? githubDarkIcon : githubLightIcon}
            height={24}
            style={{ verticalAlign: 'middle' }}
          />
        </div>
      </a>
    </Tooltip>
  );
}
