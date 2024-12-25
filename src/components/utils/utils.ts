
import {PhantomProvider} from '../interface/interface'
/**
 * Get Phantom wallet provider, if available
 */
export const getProvider = (): PhantomProvider | undefined => {
    if ('solana' in window) {
        const provider = (window as any).solana;
        if (provider.isPhantom) 
            return provider as PhantomProvider;
    }
    return undefined;
};
