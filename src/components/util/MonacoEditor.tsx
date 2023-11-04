import { Editor } from '@monaco-editor/react';
import { Spin } from 'antd';
import { editor } from 'monaco-editor';
import { useState } from 'react';

export function MonacoEditor(props: {
  text?: string;
  isDarkMode: boolean;
  language?: string;
  onChange?: (s?: string) => void;
  options?: Omit<
    editor.IStandaloneEditorConstructionOptions,
    /* updateHeightの挙動がおかしくなるため、scrollBeyondLastLineはfalseに設定する必要がある。そのため、上書きさせない*/
    'scrollBeyondLastLine'
  >;
}) {
  const [editorHeight, setEditorHeight] = useState<string | number | undefined>(
    undefined,
  );

  const updateHeight = (editor: editor.IStandaloneCodeEditor | null) => {
    if (editor) {
      const height = Math.max(40, editor.getContentHeight());
      setEditorHeight(height);
    }
  };

  return (
    <Editor
      height={editorHeight}
      defaultLanguage={props.language}
      defaultValue={props.text}
      loading={<Spin />}
      options={{
        ...{
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          wordWrap: 'on',
        },
        ...props.options,
      }}
      onChange={props.onChange}
      theme={props.isDarkMode ? 'vs-dark' : 'light'}
      onMount={(editor, _monaco) => {
        editor.onDidContentSizeChange(() => {
          updateHeight(editor);
        });
      }}
    />
  );
}
