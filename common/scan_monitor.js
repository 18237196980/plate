var receiver;
var main;

// 注册扫描设备的广播监听
function register(){
	main = plus.android.runtimeMainActivity(); //获取activity
	receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
		onReceive: function(context, intent) {
			plus.android.importClass(intent); //通过intent实例引入intent类，方便以后的‘.’操作
			let scanContent = intent.getStringExtra('barcode_string');
			console.log(scanContent); //获取数据
			uni.$emit('scan-success',{data:scanContent});
		}
	});
	var IntentFilter = plus.android.importClass('android.content.IntentFilter');
	var Intent = plus.android.importClass('android.content.Intent');
	var filter = new IntentFilter();
	filter.addAction('android.intent.ACTION_DECODE_DATA'); //监听扫码广播
	main.registerReceiver(receiver, filter); //注册监听
	console.log('scan monitor register')
}

// 取消扫码设备的广播监听
function unregister(){
	console.log('scan monitor unregister')
	main.unregisterReceiver(receiver); //取消监听
}

module.exports = {
	register,
	unregister
}