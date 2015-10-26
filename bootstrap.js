const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;

Cu.import('resource://gre/modules/Services.jsm');

var urls_block = [
    'audiovideofotobild.de',
    'autobild.de',
    'autobild.tv',
    'autobildallrad.de',
    'axel-springer-akademie.de',
    'axelspringer.de',
    'axelspringer-syndication.de',
    'bams.de',
    'bild.de',
    'computerbild.de',
    'computerbildspiele.de',
    'ein-herz-fuer-kinder.de',
    'n24.de',
    'sportbild.de',
    'wams.de',
    'welt.de',
    'weltn24.de'
];

var observers = {
    'http-on-modify-request': {
        observe: function (aSubject, aTopic, aData) {
            console.info('http-on-modify-request: aSubject = ' + aSubject + ' | aTopic = ' + aTopic + ' | aData = ' + aData);
            var httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
            var requestUrl = httpChannel.URI.spec.toLowerCase();
            for (var i=0; i<urls_block.length; i++) {
                if (requestUrl.indexOf(urls_block[i]) > -1) {
                    var redirect = 'chrome://' + self.id + '/content/block.html' + '#' + requestUrl;
                    httpChannel.redirectTo(Services.io.newURI(redirect, null, null));
                    break;
                }
            }
        },
        reg: function () {
            Services.obs.addObserver(observers['http-on-modify-request'], 'http-on-modify-request', false);
        },
        unreg: function () {
            Services.obs.removeObserver(observers['http-on-modify-request'], 'http-on-modify-request');
        }
    }
};

function install() {}

function uninstall() {}

function startup() {
 for (var o in observers) {
 	observers[o].reg();
 }
}

function shutdown(aData, aReason) {
 if (aReason == APP_SHUTDOWN) return;

 for (var o in observers) {
 	observers[o].unreg();
 }
}
