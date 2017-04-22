windows下为了一键搞定加密，拷贝等功能，特意写了一个bat文件
如下：

`@echo off

set QUICK_COCOS2DX = "%QUICK_V3_ROOT%bin\"

if exist "F:\doodlev3\res_cn" rmdir /s /q "F:\doodlev3\res_cn"

rem xcopy /Y F:\doodlev3\res F:\doodlev3\res_cn\ /e`

rem 如果写上这句，则会报文件已存在的错误，2.x是可以这样的,3.x不可以

echo - encrypto res

call F:\Quick-Cocos2dx-Community\quick\bin\encrypt_res.bat -i F:\doodlev3\res -o F:\doodlev3\res_cn -es xxx -ek yyy

echo - encrypto scr

call F:\Quick-Cocos2dx-Community\quick\bin\compile_scripts.bat -i F:\doodlev3\src -o F:\doodlev3\res_cn\game.zip -e xxtea_zip

-es xxx -ek yyy

echo - build project

call build_native.bat

######
这个地方是要用python写生成一个flist.lua文件，里面包含资源和对应的MD5文件，热更新用，请看"生成热更新之生成flist.lua文件"
######

echo - ok complete!

pause

解释：具体的加密过程看泰然网的开发文档就可以了，很详细。
     res_cn用来存放加密文件和加密资源的，在真机上就是读的这个文件，而默认的是将src和res分别拷贝到assets中，但是现在需要把res_cn拷贝到assets中，所以
     就要修改build_native_release.bat文件
     将echo - copy scripts
       mkdir "%APP_ANDROID_ROOT%assets\src"
       xcopy /s /q "%APP_ROOT%src\*.*" "%APP_ANDROID_ROOT%assets\src\"
       echo - copy resources
       mkdir "%APP_ANDROID_ROOT%assets\res_cn"
       xcopy /s /q "%APP_ROOT%res\*.*" "%APP_ANDROID_ROOT%assets\res\"
      改为
      echo - copy scripts
      rem mkdir "%APP_ANDROID_ROOT%assets\src"
      rem xcopy /s /q "%APP_ROOT%src\*.*" "%APP_ANDROID_ROOT%assets\src\"
      echo - copy resources
      mkdir "%APP_ANDROID_ROOT%assets\res_cn"
      xcopy /s /q "%APP_ROOT%res_cn\*.*" "%APP_ANDROID_ROOT%assets\res_cn\"
