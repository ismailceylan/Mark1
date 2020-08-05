require.config({ packages: [

	/*
	 * ---------------------------------------------------------------
	 *   PACKAGE KISAYOLLARI
	 * ---------------------------------------------------------------
	 *
	 * Sistem tarafından sunulan package'lara erişirken sadece isimleriyle
	 *   erişmeyi sağlar. Burada kaydı bulunan bir paket herhangi bir
	 *   yerde sadece adı verilerek require edilebilme özelliği kazanır
	 *   bütün package yolunu her package yüklerken yazmak gerekmez.
	 */ 
	{ name: "dialog", location: "system/package/dialog" },
	{ name: "alert", location: "system/package/alert" },
	{ name: "member-center", location: "system/package/member-center" },
	{ name: "file-picker", location: "system/package/file-picker" },
	{ name: "file-monitoring", location: "system/package/file-monitoring" },
	{ name: "dropdown", location: "system/package/dropdown" },
	{ name: "menu", location: "system/package/menu" },
	{ name: "resource-loading-indicator", location: "system/package/resource-loading-indicator" },
	{ name: "reactable", location: "system/package/reactable" },
	{ name: "display-messages", location: "system/package/display-messages" }
]});
