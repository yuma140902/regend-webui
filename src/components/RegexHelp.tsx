import { Typography } from 'antd';

export function RegexHelp() {
  return (
    <>
      <Typography.Title level={2}>正規表現の文法</Typography.Title>
      <Typography.Paragraph>
        Regendで使用する正規表現の文法は以下の通りです。
        <pre>{`<expr> := <orterm> [ '|' <orterm> ]*
<orterm> := <catterm> [ <catterm> ]*
<catterm> := <repterm> [ '*' ]?
<repterm> := '(' <expr> ')'
           | '0'～'9'
           | 'a'～'z'
           | 'A'～'Z'
           | 'φ'
`}</pre>
        空白や改行は無視されるので読みやすいように好きな場所に入れることができます。
      </Typography.Paragraph>
      <Typography.Title level={2}> 正規表現の意味論</Typography.Title>

      <Typography.Paragraph>
        <ul>
          <li>
            <Typography.Text code>φ</Typography.Text> - 何も受理しない
          </li>
          <li>
            <Typography.Text code>0</Typography.Text>～
            <Typography.Text code>9</Typography.Text>,{' '}
            <Typography.Text code>a</Typography.Text>～
            <Typography.Text code>z</Typography.Text>,{' '}
            <Typography.Text code>A</Typography.Text>～
            <Typography.Text code>Z</Typography.Text> - その1文字を表す
          </li>
          <li>
            A<Typography.Text code>|</Typography.Text>B -
            正規表現Aと正規表現Bの選択
          </li>
          <li> AB - 正規表現Aと正規表現Bの連接</li>
          <li>
            A<Typography.Text code>*</Typography.Text> -
            正規表現Aの0回以上の繰り返し
          </li>
        </ul>
      </Typography.Paragraph>
      <Typography.Paragraph>
        優先順位は繰り返し、連接、選択の順に高いです。
        <Typography.Text code>(</Typography.Text>
        <Typography.Text code>)</Typography.Text>
        を使用すると優先順位を変えることができます。
      </Typography.Paragraph>

      <Typography.Paragraph>
        以下のようなよくある糖衣構文は実装していません。かわりに矢印で示した表記を使ってください。
      </Typography.Paragraph>
      <Typography.Paragraph>
        <ul>
          <li>
            空文字列 →<Typography.Text code>φ*</Typography.Text>
          </li>
          <li>
            A<Typography.Text code>?</Typography.Text> -
            正規表現Aが0回または1回出現する →{' '}
            <Typography.Text code>(φ*|</Typography.Text>A
            <Typography.Text code>)</Typography.Text>
          </li>
          <li>
            A<Typography.Text code>+</Typography.Text> -
            正規表現Aの1回以上の繰り返し → AA
            <Typography.Text code>*</Typography.Text>
          </li>
        </ul>
      </Typography.Paragraph>
    </>
  );
}
