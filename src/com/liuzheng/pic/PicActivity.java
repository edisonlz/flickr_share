package com.liuzheng.pic;


import android.os.Bundle;
import com.phonegap.*;

public class PicActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //this.appView.setBackgroundColor(0);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}