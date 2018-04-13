
	function page(){};
	
	page.url = '';
	page.data = {};
	page.success = function(status){};
	page.dataType = 'JSONP';

	// 临时对象
	page.tmpObj = '';
	// 保存城市数据
	page.keepCityData = '';

	// ajax获取数据
	page.ajax = function(url, data, success, dataType){
		$.get(url, data, success, dataType);
	}
	// 获取页面数据
	page.getInfo = function(url, success){
		page.url = url;
		page.data = {};
		page.success = success;

		page.ajax(page.url, page.data, page.success, page.dataType);
	}
	// 天气页面回调函数
	page.weatherCallback = function(status){
			// 页面填充数据
			page.setWeatherInfo(status);
	}
	// 天气页面渲染数据
	page.setWeatherInfo = function(status){
console.log(status);
		// 保存临时对象
		page.tmpObj = status.data.weather;
		// 填充城市数据
		page.renderingFunc('header .top-bar',page.tmpObj.city_name);
		// 空气质量
		page.renderingFunc('header .breathPollute p:last-child',page.tmpObj.quality_level+'污染');

		// 温度填充
		page.renderingFunc('header .temperature',page.tmpObj.current_temperature+'°');
		// 天气阴晴
		page.renderingFunc('header .weather',page.tmpObj.current_condition);
		// 今天温度范围
		page.renderingFunc('.todayAndTommWeather .today .today-top .today-top-right span:last-child',page.tmpObj.dat_low_temperature+'°');
		page.renderingFunc('.todayAndTommWeather .today .today-top .today-top-right span:first-child',page.tmpObj.dat_high_temperature);
		// 今天天气
		page.renderingFunc('.todayAndTommWeather .today .today-bottom .today-bottom-left',page.tmpObj.day_condition);
		// 今天天气图标
		$('.todayAndTommWeather .today .today-bottom .today-bottom-right')[0].style.backgroundImage = 'url(img/'+page.tmpObj.dat_weather_icon_id+'.png)';
		// 明天温度范围		alert(a);
		page.renderingFunc('.todayAndTommWeather .tomm .today-top .today-top-right span:last-child',page.tmpObj.tomorrow_low_temperature+'°');
		page.renderingFunc('.todayAndTommWeather .tomm .today-top .today-top-right span:first-child',page.tmpObj.tomorrow_high_temperature);
		// 明天天气
		page.renderingFunc('.todayAndTommWeather .tomm .today-bottom .today-bottom-left',page.tmpObj.tomorrow_condition);
		// 明天天气图标
		$('.todayAndTommWeather .tomm .today-bottom .today-bottom-right')[0].style.backgroundImage = 'url(img/'+page.tmpObj.dat_weather_icon_id+'.png)';


		var str = '';
		/* 24小时天气 */
		// 判断24小时天气是否存在
		if(typeof(page.tmpObj.hourly_forecast) != 'undefined'){
			for(i = 0; i < page.tmpObj.hourly_forecast.length; ++i)
			{
				str+='<div class="weatherList"><p class="weatherTime">';
				str+= page.tmpObj.hourly_forecast[i].hour+':00';
				str+='<p class="weatherLogo" style="background: url(img/'+page.tmpObj.hourly_forecast[i].weather_icon_id+'.png) no-repeat center;background-position: center;background-size: 0.4rem;"></p><p class="timeTemperature">';
				str+= page.tmpObj.hourly_forecast[i].temperature+'°';
				str+='</p></div>';
			}
			// 追加24小时天气
			$('.oneDayWeather .content').html(str);
		}

		/*一周 天气预测*/
		str = '';
		// 判断一周天气是否存在
		if(typeof(page.tmpObj.forecast_list) != 'undefined'){
			for(i = 0; i < page.tmpObj.forecast_list.length; ++i)
			{

					str+='<div class="weatherList">';

					// 判断今天 明天 后天
					if(i == 0)
						str+=	'<p>昨天</p>';	
					else if(i == 1)
						str+=	'<p>今天</p>';	
					else if(i == 2)
						str+=	'<p>后天</p>';
					else
					{
						// 判断是星期几
						switch(new Date(page.tmpObj.forecast_list[i].date).getDay())
						{
							case 0: str+='<p>周日</p>';break;
							case 1: str+='<p>周一</p>';break;
							case 2: str+='<p>周二</p>';break;
							case 3: str+='<p>周三</p>';break;
							case 4: str+='<p>周四</p>';break;
							case 5: str+='<p>周五</p>';break;
							case 6: str+='<p>周六</p>';break;
						}
					}

					str+=	'<p><span>'+page.tmpObj.forecast_list[i].date.slice(5,7)+'</span>/<span>'+page.tmpObj.forecast_list[i].date.slice(8,10)+'</span></p>';
					str+=	'<p>'+page.tmpObj.forecast_list[i].condition+'</p>';
					str+=	'<p style="background: url(img/'+page.tmpObj.forecast_list[i].weather_icon_id+'.png) no-repeat center;background-position: center;background-size: 0.4rem;"></p>';
					str+=	'<p>'+page.tmpObj.forecast_list[i].high_temperature+'°'+'</p>';
					str+=	'<p>'+page.tmpObj.forecast_list[i].low_temperature+'°'+'</p>';
					str+=	'<p style="background: url(img/'+page.tmpObj.forecast_list[i].weather_icon_id+'.png) no-repeat center;background-position: center;background-size: 0.4rem;"></p>';
					str+=	'<p>'+page.tmpObj.forecast_list[i].condition+'</p>';
					str+=	'<p>'+page.tmpObj.forecast_list[i].wind_direction+'</p>';
					str+=	'<p>'+page.tmpObj.forecast_list[i].wind_level+'级'+'</p>';
					str+='</div>';
			}

			$('.oneWeekWeather .content').html(str);	
		}
	}
	// 天气页面渲染函数
	page.renderingFunc = function(element, value){
		$(element).text(value);
	}

	// 城市页面回调函数
	page.cityCallback = function(status){

			// 保存城市数据（搜索的时候要用）
			page.keepCityData = status;
			// 页面填充数据
			page.setCityInfo(status);
	}
	// 城市页面渲染数据
	page.setCityInfo = function(status){
		// 渲染热门城市数据
		// 1、直接追加内容的方式
		str = '';
		for(value in status.data){
			
			// var el1 = document.createElement('li');
			// el1.classList.add('.city-list');
			// el1.innerText = value;
			// appendChild()
			// $('.city .hot-city .hot-city-info ul').append(el1);
			
			/*
				方法一：直接当内容追加到页面中
			 */
			// str+='<p>'+value+'</p><div class="hot-city-info"><ul>';
			// 	// 遍历市
			// 	for(values in status.data[value])
			// 		str+='<li id="city-list">'+values+'</li>';
			// str+='</ul></div>';

			/*
				方法二：创建元素的方法来追加到页面中
			 */
			// 创建省级城市元素
			var province = document.createElement('p');
			// 追加省级城市名称
			province.innerText = value;
			// 创建hot-city-info
			var cityDiv = document.createElement('div');
			// 添加类名
			cityDiv.className = 'hot-city-info';
			// 创建ul元素
			var cityUl = document.createElement('ul');
			// 遍历市级元素
			// 开始渲染市级内容 for in
			for(values in status.data[value]){
				// 创建li
				var cityli = document.createElement('li');
				$(cityli).attr('class','city-list');
				// 向li追加市级名称
				cityli.innerText = values;
				// 追加到ul中
				cityUl.appendChild(cityli);
			}
			// ul追加到cityInfo中，p追加到hot-city中，cityInfo追加到hot-city中
			cityDiv.appendChild(cityUl);
			$('.city .hot-city')[0].appendChild(province);
			$('.city .hot-city')[0].appendChild(cityDiv);
		}

		// 方法一中的 方法二中需要去掉
		// $('.city .hot-city').html(str);
	}
	// 点击城市重新渲染数据
	page.tap = function(){
		// 点击天气
		$(".city-list").on('click',function(){
			// 消失
			$('.city').fadeToggle();
			$('.weatherPage').fadeIn();
			// 天气页面数据获取并且渲染
			page.getInfo('https://www.toutiao.com/stream/widget/local_weather/data/?city='+this.innerText,page.weatherCallback);			
		});	
		// 点击城市出现城市列表
		$('.top-bar').on('click',function(){
			// 出现
			$('.city').fadeToggle();
		});
		// 城市输入框获取焦点
		$('.city .search .search-box input').on('focus',function(){
			// 取消按钮变搜索
			$('.city .search .cancel').text('搜索');
		});
		// 城市输入框丢失焦点
		// $('.city .search .search-box input').on('blur',function(){
		// 	// 取消按钮变搜索
		// 	$('.city .search .cancel').text('取消');
		// });		
		// 点击搜索框中的取消
		$('.city .search .cancel').on('click',function(){
			// 判断是搜索还是取消
			var cancelContent = this.innerText;
			if(cancelContent == '搜索'){
				// 获取输入框中的内容，并且清空内容空格
				var inputContent = $.trim($('.city .search .search-box input').val());
				console.log(page.keepCityData);
				// 遍历循环匹配数据
				var flagFind = false;
				for(value1 in page.keepCityData.data){
					for(value2 in page.keepCityData.data[value1]){

						// 匹配到
						if(inputContent == value2 || inputContent == value2+'市'){
							flagFind == true;
							$('.city').fadeToggle();
							$('.weatherPage').fadeIn();						
							page.getInfo('https://www.toutiao.com/stream/widget/local_weather/data/?city='+value2,page.weatherCallback);				
							return;
						}
					}
				}

				// 判断是否匹配到
				flagFind ?console.log(1) : alert('查询城市不存在');
			}	
			else if(cancelContent == '取消'){
				// 隐藏选择城市页面
				$('.city').fadeOut();
			}
		});
	}	


window.onload = function(){
	// 天气页面数据获取并且渲染
	page.getInfo('https://www.toutiao.com/stream/widget/local_weather/data/?city=吕梁',page.weatherCallback);
	// 城市页面数据获取并且渲染
	page.getInfo('https://www.toutiao.com/stream/widget/local_weather/city/',page.cityCallback);
	// 点击城市重新渲染数据
	setTimeout(function(){
		page.tap();
	},150);  
}