package org.xmlpull.p019v1;

import java.io.InputStream;
import java.io.Reader;

/* renamed from: org.xmlpull.v1.XmlPullParser */
/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public interface XmlPullParser {
    public static final int CDSECT = 5;
    public static final int COMMENT = 9;
    public static final int DOCDECL = 10;
    public static final int END_DOCUMENT = 1;
    public static final int END_TAG = 3;
    public static final int ENTITY_REF = 6;
    public static final String FEATURE_PROCESS_DOCDECL = "http://xmlpull.org/v1/doc/features.html#process-docdecl";
    public static final String FEATURE_PROCESS_NAMESPACES = "http://xmlpull.org/v1/doc/features.html#process-namespaces";
    public static final String FEATURE_REPORT_NAMESPACE_ATTRIBUTES = "http://xmlpull.org/v1/doc/features.html#report-namespace-prefixes";
    public static final String FEATURE_VALIDATION = "http://xmlpull.org/v1/doc/features.html#validation";
    public static final int IGNORABLE_WHITESPACE = 7;
    public static final String NO_NAMESPACE = "";
    public static final int PROCESSING_INSTRUCTION = 8;
    public static final int START_DOCUMENT = 0;
    public static final int START_TAG = 2;
    public static final int TEXT = 4;
    public static final String[] TYPES = {"START_DOCUMENT", "END_DOCUMENT", "START_TAG", "END_TAG", "TEXT", "CDSECT", "ENTITY_REF", "IGNORABLE_WHITESPACE", "PROCESSING_INSTRUCTION", "COMMENT", "DOCDECL"};

    void defineEntityReplacementText(String str, String str2);

    int getAttributeCount();

    String getAttributeName(int i);

    String getAttributeNamespace(int i);

    String getAttributePrefix(int i);

    String getAttributeType(int i);

    String getAttributeValue(int i);

    String getAttributeValue(String str, String str2);

    int getColumnNumber();

    int getDepth();

    int getEventType();

    boolean getFeature(String str);

    String getInputEncoding();

    int getLineNumber();

    String getName();

    String getNamespace();

    String getNamespace(String str);

    int getNamespaceCount(int i);

    String getNamespacePrefix(int i);

    String getNamespaceUri(int i);

    String getPositionDescription();

    String getPrefix();

    Object getProperty(String str);

    String getText();

    char[] getTextCharacters(int[] iArr);

    boolean isAttributeDefault(int i);

    boolean isEmptyElementTag();

    boolean isWhitespace();

    int next();

    int nextTag();

    String nextText();

    int nextToken();

    void require(int i, String str, String str2);

    void setFeature(String str, boolean z);

    void setInput(InputStream inputStream, String str);

    void setInput(Reader reader);

    void setProperty(String str, Object obj);
}
