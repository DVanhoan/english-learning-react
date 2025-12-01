export default function LogoLoader() {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
            <div className="relative flex flex-col items-center">
                <div className="relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full border-4 border-primary-color/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary-color border-t-transparent animate-spin" />
                    <img
                        src="/images/student.png"
                        alt="Logo"
                        className="absolute inset-0 m-auto h-10 w-10 object-contain"
                    />
                </div>
                <div className="mt-5 text-center">
                    <p className="text-primary-color font-semibold tracking-wide">
                        K-English
                    </p>
                    <p className="text-sm text-primary-color/70 animate-pulse">
                        Đang tải...
                    </p>
                </div>
            </div>
        </div>
    );
}
