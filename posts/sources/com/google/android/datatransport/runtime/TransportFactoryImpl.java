package com.google.android.datatransport.runtime;

import com.google.android.datatransport.Encoding;
import com.google.android.datatransport.Transformer;
import com.google.android.datatransport.Transport;
import com.google.android.datatransport.TransportFactory;
import java.util.Set;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public final class TransportFactoryImpl implements TransportFactory {
    private final Set<Encoding> supportedPayloadEncodings;
    private final TransportContext transportContext;
    private final TransportInternal transportInternal;

    public TransportFactoryImpl(Set<Encoding> set, TransportContext transportContext, TransportInternal transportInternal) {
        this.supportedPayloadEncodings = set;
        this.transportContext = transportContext;
        this.transportInternal = transportInternal;
    }

    @Override // com.google.android.datatransport.TransportFactory
    public <T> Transport<T> getTransport(String str, Class<T> cls, Transformer<T, byte[]> transformer) {
        return getTransport(str, cls, Encoding.m1118of("proto"), transformer);
    }

    @Override // com.google.android.datatransport.TransportFactory
    public <T> Transport<T> getTransport(String str, Class<T> cls, Encoding encoding, Transformer<T, byte[]> transformer) {
        if (this.supportedPayloadEncodings.contains(encoding)) {
            return new TransportImpl(this.transportContext, str, encoding, transformer, this.transportInternal);
        }
        throw new IllegalArgumentException(String.format("%s is not supported byt this factory. Supported encodings are: %s.", encoding, this.supportedPayloadEncodings));
    }
}