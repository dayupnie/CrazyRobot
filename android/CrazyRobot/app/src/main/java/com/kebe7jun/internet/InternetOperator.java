package com.kebe7jun.internet;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by kebe on 15-1-2.
 * 网络操作
 */
public class InternetOperator {

    public static String getDataFromInternet(String path) throws IOException {
        URL url = new URL(path);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");   //设置请求方法为GET
        conn.setReadTimeout(5 * 1000);    //设置请求过时时间为5秒
        InputStream inputStream = conn.getInputStream();
        String result = inputStream.toString();
        return result;
    }

    public static String postDataToInternet(String postData, String loginUrl) throws JSONException {
        HttpEntityEnclosingRequestBase httpRequest = new HttpPost(loginUrl);
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("question", postData));
        try {
            httpRequest.setEntity(new UrlEncodedFormEntity(params, HTTP.UTF_8));
            HttpResponse httpResponse = new DefaultHttpClient().execute(httpRequest);
            if (httpResponse.getStatusLine().getStatusCode() == 200) {
                String strResult = null;
                strResult = EntityUtils.toString(httpResponse.getEntity());
                return strResult;
            } else {
                return httpResponse.getStatusLine().toString();
            }

        } catch (Exception e) {
            return null;
        }
    }
}