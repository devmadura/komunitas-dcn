export default const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const httpUrl = 'http://pendaftaran.dcnunira.dev';
    window.open(httpUrl, '_blank', 'noopener,noreferrer');
  };