package com.google.firebase.platforminfo;

import com.google.firebase.components.Component;
import com.google.firebase.components.ComponentContainer;
import com.google.firebase.components.ComponentFactory;
import com.google.firebase.components.Dependency;
import java.util.Iterator;
import java.util.Set;

/* loaded from: /home/clement/Documents/site/ma_vie/content/posts/vulnerabilite-izly/resources/classes.dex */
public class DefaultUserAgentPublisher implements UserAgentPublisher {
    private final GlobalLibraryVersionRegistrar gamesSDKRegistrar;
    private final String javaSDKVersionUserAgent;

    public DefaultUserAgentPublisher(Set<LibraryVersion> set, GlobalLibraryVersionRegistrar globalLibraryVersionRegistrar) {
        this.javaSDKVersionUserAgent = toUserAgent(set);
        this.gamesSDKRegistrar = globalLibraryVersionRegistrar;
    }

    public static Component<UserAgentPublisher> component() {
        ComponentFactory componentFactory;
        Component.Builder add = Component.builder(UserAgentPublisher.class).add(Dependency.setOf(LibraryVersion.class));
        componentFactory = DefaultUserAgentPublisher$$Lambda$1.instance;
        return add.factory(componentFactory).build();
    }

    public static /* synthetic */ UserAgentPublisher lambda$component$0(ComponentContainer componentContainer) {
        return new DefaultUserAgentPublisher(componentContainer.setOf(LibraryVersion.class), GlobalLibraryVersionRegistrar.getInstance());
    }

    private static String toUserAgent(Set<LibraryVersion> set) {
        StringBuilder sb = new StringBuilder();
        Iterator<LibraryVersion> it = set.iterator();
        while (it.hasNext()) {
            LibraryVersion next = it.next();
            sb.append(next.getLibraryName());
            sb.append('/');
            sb.append(next.getVersion());
            if (it.hasNext()) {
                sb.append(' ');
            }
        }
        return sb.toString();
    }

    @Override // com.google.firebase.platforminfo.UserAgentPublisher
    public String getUserAgent() {
        if (this.gamesSDKRegistrar.getRegisteredVersions().isEmpty()) {
            return this.javaSDKVersionUserAgent;
        }
        return this.javaSDKVersionUserAgent + ' ' + toUserAgent(this.gamesSDKRegistrar.getRegisteredVersions());
    }
}
