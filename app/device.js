/* Public Tizen application APIs. No Mac server, network address or credentials. */
(function () {
  'use strict';
  var IDS = {
    netflix: 'org.tizen.netflix-app',
    youtube: '9Ur5IzDKqV.TizenYouTube',
    disneyplus: 'MCmYXNxgcu.DisneyPlus',
    primevideo: 'org.tizen.primevideo',
    appletv: 'com.samsung.tv.aria-video',
    bbciplayer: 'DqEoaplKlw.bbchybrid',
    itvx: 'OEvCiupaFR.ITVHub',
    channel4: 'OCaxbgg9v6.chfourctv'
  };
  var STREAMING = ['as6cYRgkPy.Binge', '73iTZRTc34.Stan', '5b8c3eb16b.BeamCTVDev',
    'cj37Ni3qXM.HBONow', 'LBUAQX1exg.Hulu', 'gzcc4LRFBF.Peacock', 'rJyOSqC6Up.CBSAllAccess',
    'Rk72oKFsRS.OtterKidsProd', '70fRFUwYlD.OtterGAProd', 'PvWgqxV3Xa.YouTubeTV',
    'XtU8fQk2gN.ESPN', 'ZmmGjO6VKO.slingtv', 'VtuWAiZdHN.STARZPlay', 'ckfgqqzvt0.dplus',
    'kk8MbItQ0H.VUDU', 'Jz7aUrV2Q4.Twitch', 'OK2Rdkjmsi.IMDbTV', 'Ob3XhAVMu6.amcplus',
    'KaLitts8bq.tenplaySamsungTizen', 'eYuOiOLYQX.KayoSports', 'Ne2ZsPWdKl.9NOW',
    '3KA0pm7a7V.TubiTV', 'rJeHak5zRg.Spotify', 'icp4AvUPiA.7plus'];
  var CONSUMER_SYSTEM = ['org.tizen.browser', 'com.microsoft.copilot'];
  var EXTRA_BRANDS = {'rJeHak5zRg.Spotify': 'spotify', '5b8c3eb16b.BeamCTVDev': 'hbomax', 'cj37Ni3qXM.HBONow': 'hbomax', '3KA0pm7a7V.TubiTV': 'tubi'};
  var INTERNAL = ['adplatform.ADPlayer', 'WykOS4t4F0.cmsWebApp', '25emanual3.emanual',
    'd0m1lV1nt2.emanual', '2022ePop01.SmartTV',
    'ZODRT12q2l.WebAccountExtension', 'ByJlgt0XeD.CastSettingsApp', 'tv6pbVMQFF.PrivacyChoices'];
  var SELF = 'nClrkHome1.FrameHome', HDMI_TARGET = 'cleanframe.hdmi';
  function api() { return window.tizen && window.tizen.application; }
  function selfId() {
    try { return api().getCurrentApplication().appInfo.id || SELF; }
    catch (err) { return SELF; }
  }
  function unavailable(done) {
    done({ message: 'Open CleanFrame on the TV to use this control.', detail: 'The web preview cannot control the TV.' });
  }
  function failure(err) {
    return { message: 'The TV could not open this screen.', detail: err && (err.message || err.name) || 'Try again, or press the remote’s Home button to return to CleanFrame.' };
  }
  function bounded(done, timeout) {
    var finished = false, timer = setTimeout(function () { finish({ message: 'The TV did not respond. Please try again.' }); }, timeout || 8000);
    function finish(err, value) { if (finished) return; finished = true; clearTimeout(timer); done(err, value); }
    return finish;
  }
  var hdmiSources = null;
  function hdmiPorts(done) {
    var T = window.tizen;
    if (!(T && T.tvwindow && T.systeminfo)) { done({ message: 'Open CleanFrame on the TV to switch inputs.' }); return; }
    var finish = bounded(done);
    try {
      T.systeminfo.getPropertyValue('VIDEOSOURCE', function (v) {
        var on = v.connected || [], off = v.disconnected || [], list = [];
        on.concat(off).forEach(function (src) {
          if (src.type === 'HDMI') list.push({ number: src.number, name: typeof src.editName === 'string' ? src.editName.slice(0, 40) : '', raw: src });
        });
        list.sort(function (x, y) { return x.number - y.number; });
        hdmiSources = list;
        finish(null, list.map(function (p) { return { number: p.number, name: p.name }; }));
      }, function (err) { finish(failure(err)); });
    } catch (err) { finish(failure(err)); }
  }
  function setHdmi(port, done) {
    var finish = bounded(done, 10000), T = window.tizen;
    function view() {
      try { T.application.launch('org.tizen.tv-viewer', function () { finish(null); }, function (err) { finish(failure(err)); }); }
      catch (err) { finish(failure(err)); }
    }
    function apply() {
      var src = null;
      (hdmiSources || []).forEach(function (p) { if (p.number === port) src = p.raw; });
      if (!src) { finish({ message: 'HDMI ' + port + ' is not available on this TV.' }); return; }
      try { T.tvwindow.setSource(src, view, function (err) { finish(failure(err)); }, 'MAIN'); }
      catch (err) { finish(failure(err)); }
    }
    if (hdmiSources) { apply(); return; }
    hdmiPorts(function (err) { if (err) finish(err); else apply(); });
  }
  function openHdmi(id, done) {
    var port = /^cleanframe\.hdmi:([1-9])$/.exec(id);
    if (!(window.tizen && window.tizen.tvwindow && port)) { unavailable(done); return; }
    setHdmi(Number(port[1]), done);
  }
  function launchApp(id, done) {
    if (id && id.indexOf(HDMI_TARGET) === 0) { openHdmi(id, done); return; }
    if (!api()) { unavailable(done); return; }
    var finish = bounded(done);
    try { api().launch(id, function () { finish(null); }, function (err) { finish(failure(err)); }); }
    catch (err) { finish(failure(err)); }
  }
  function launch(brand, done) {
    if (!IDS[brand]) { done({message: 'This app has no launch target.'}); return; }
    launchApp(IDS[brand], done);
  }
  function art(done) {
    if (!api()) { unavailable(done); return; }
    var finish = bounded(done);
    try {
      var data = [new tizen.ApplicationControlData('mode', ['fullscreen']), new tizen.ApplicationControlData('requester', ['mobile'])];
      var control = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/default', null, null, null, data);
      api().launchAppControl(control, 'org.tizen.art-app', function () { finish(null); }, function (err) { finish(failure(err)); });
    } catch (err) { finish(failure(err)); }
  }
  function home(done) { launchApp('com.samsung.tv.csfs', done); }
  function settings(done) { launchApp('com.samsung.tv.coba.setting', done); }
  function apps(done) {
    if (!api()) { unavailable(done); return; }
    // Large installed catalogues can take longer than a launch response.
    var finish = bounded(done, 20000);
    try {
      api().getAppsInfo(function (list) {
        var known = {}, seen = {}, result = [], self = selfId();
        Object.keys(IDS).forEach(function (brand) { known[IDS[brand]] = brand; });
        list.forEach(function (a) {
          var primary = !!known[a.id], stream = STREAMING.indexOf(a.id) >= 0;
          var consumer = /^[A-Za-z0-9]{10}\.[A-Za-z0-9_-]+$/.test(a.id) || CONSUMER_SYSTEM.indexOf(a.id) >= 0;
          if (a.id === self || INTERNAL.indexOf(a.id) >= 0 || seen[a.id] || !a.name || (!primary && !stream && (!a.show || !consumer))) return;
          if (!primary && /(?:service|worker|preview|promotion|plugin|launcher|test|sdk|^ep[ -]|factory|daemon)/i.test(a.name + ' ' + a.id)) return;
          if (/-dummy$/.test(a.id) || a.id === 'com.samsung.tv.cobalt-yt') return;
          seen[a.id] = true;
          result.push({ appId: a.id, name: a.name, brand: known[a.id] || EXTRA_BRANDS[a.id] || '', icon: a.iconPath || '', rank: primary ? Object.keys(IDS).indexOf(known[a.id]) : (stream ? 20 : 30) });
        });
        result.sort(function (a, b) { return a.rank - b.rank || a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });
        finish(null, result);
      }, function (err) { finish(failure(err)); });
    } catch (err) { finish(failure(err)); }
  }
  window.FrameDevice = { launch: launch, launchApp: launchApp, hdmiPorts: hdmiPorts, art: art, home: home, settings: settings, apps: apps };
}());
