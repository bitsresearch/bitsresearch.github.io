// version: 7.12.0.a.1.6.7
// sha: 04d5c62096c01fb7b57fefc794eec50087e604a5
function SetBookmark(){var o=window.parent,t=window.location.href;o.SetBookmark(t.substring(t.toLowerCase().lastIndexOf("/scormcontent/")+14,t.length),document.title),o.CommitData()}SetBookmark();