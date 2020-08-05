@echo off

if not "%1"=="am_admin" (powershell start -verb runas '%0' am_admin & exit /b)

cls

CD C:\wamp64\www\mark1
set /p projectName="Proje adi: "

if exist %projectName% (
	echo Bu isimde bir proje zaten var!
) else (
	
	mkdir %CD%\%projectName%
	mkdir %CD%\%projectName%\application
	mkdir %CD%\%projectName%\application\component
	mkdir %CD%\%projectName%\application\config
	mkdir %CD%\%projectName%\application\controller
	mkdir %CD%\%projectName%\application\core
	mkdir %CD%\%projectName%\application\helper
	mkdir %CD%\%projectName%\application\language
	mkdir %CD%\%projectName%\application\library
	mkdir %CD%\%projectName%\application\library\markdown
	mkdir %CD%\%projectName%\application\library\markdown\plugins
	mkdir %CD%\%projectName%\application\library\support
	mkdir %CD%\%projectName%\application\library\support\markdown-renderer
	mkdir %CD%\%projectName%\application\library\bootstrap
	mkdir %CD%\%projectName%\application\listener
	mkdir %CD%\%projectName%\application\middleware
	mkdir %CD%\%projectName%\application\package
	mkdir %CD%\"%projectName%\application\route"
	mkdir %CD%\%projectName%\application\trait
	mkdir %CD%\%projectName%\application\worker

	mklink %CD%\%projectName%\i18n.js %CD%\i18n.js
	mklink %CD%\%projectName%\text.js %CD%\text.js
	mklink %CD%\%projectName%\r.js %CD%\r.js
	mklink /d %CD%\%projectName%\system %CD%\system

	mklink %CD%\%projectName%\application\library\markdown\markdown.js %CD%\application\library\markdown\markdown.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\bkz.js %CD%\application\library\markdown\plugins\bkz.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\conversation.js %CD%\application\library\markdown\plugins\conversation.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\direct-bkz.js %CD%\application\library\markdown\plugins\direct-bkz.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\duyoji.js %CD%\application\library\markdown\plugins\duyoji.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\hashtag.js %CD%\application\library\markdown\plugins\hashtag.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\index.js %CD%\application\library\markdown\plugins\index.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\photo.js %CD%\application\library\markdown\plugins\photo.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\short-bkz.js %CD%\application\library\markdown\plugins\short-bkz.js
	mklink %CD%\%projectName%\application\library\markdown\plugins\spoiler.js %CD%\application\library\markdown\plugins\spoiler.js
	mklink %CD%\%projectName%\application\library\support\markdown-renderer\html-conversation.js %CD%\application\library\support\markdown-renderer\html-conversation.js
	mklink %CD%\%projectName%\application\library\support\markdown-renderer\html-table.js %CD%\application\library\support\markdown-renderer\html-table.js

	copy     /v %CD%\app.js %CD%\%projectName%\app.js
	copy     /v %CD%\index.html %CD%\%projectName%\index.html
	xcopy /s /v %CD%\application\config %CD%\%projectName%\application\config
	xcopy /s /v %CD%\application\controller %CD%\%projectName%\application\controller
	xcopy /s /v %CD%\application\core %CD%\%projectName%\application\core
	xcopy /s /v %CD%\application\language %CD%\%projectName%\application\language
	xcopy /s /v %CD%\application\listener %CD%\%projectName%\application\listener
	xcopy /s /v %CD%\application\library\bootstrap %CD%\%projectName%\application\library/bootstrap
	xcopy /s /v %CD%\application\middleware %CD%\%projectName%\application\middleware
	xcopy /s /v "%CD%\application\route" "%CD%\%projectName%\application\route"

	echo Proje %projectName% hazir. Muhtesem bir seyler kodla!
)

pause
