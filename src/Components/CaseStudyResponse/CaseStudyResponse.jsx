import MarkdownPreview from '@uiw/react-markdown-preview';
export default function CaseStudyResponse({ answer }) {
  return (
    <>
      <MarkdownPreview source={answer} />
    </>
  );
}
