// Google Analytics bootstrap, kept in a file (not inline) so the
// Content-Security-Policy doesn't need 'unsafe-inline' for scripts.
(function () {
    var id = document.currentScript && document.currentScript.getAttribute('data-ga-id');
    if (!id) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
})();
