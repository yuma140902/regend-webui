import { GithubFilled } from '@ant-design/icons';
import { Result, Typography } from 'antd';

type Props = {
  appIcon: string;
  appName: string;
  githubRepo: string;
  version: string;
  description: string;
};

/**
 * アプリケーションの情報を表示する
 */
export function AboutApp({
  appIcon,
  appName,
  githubRepo,
  version,
  description,
}: Props) {
  return (
    <Result
      icon={<img src={appIcon} style={{ maxWidth: '100%', height: 'auto' }} />}
      title={appName}
      extra={
        <>
          <Typography.Paragraph
            type="secondary"
            style={{
              wordBreak: 'keep-all',
              width: '100%',
              textAlign: 'center',
            }}
          >
            {description}
          </Typography.Paragraph>

          <GithubFilled />
          <Typography.Link
            href={`https://github.com/${githubRepo}`}
            target="_blank"
          >
            {githubRepo}
          </Typography.Link>
          <br />

          <Typography.Text type="secondary">
            バージョン: {version}
          </Typography.Text>
        </>
      }
    />
  );
}
