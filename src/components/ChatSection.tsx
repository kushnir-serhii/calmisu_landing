const ChatSection = () => {
  return (
    <section className="w-full px-6 md:px-[140px] py-[120px] overflow-hidden">
      <div className="relative flex justify-center items-center">
        <img src="/images/chat-illustration.webp" alt="Calmisu AI chat" className="w-full max-w-[766px] relative z-10" loading="lazy" />
        <img src="/images/cloud-small.webp" alt="" className="absolute left-0 bottom-0 w-[55%] max-w-[791px] opacity-80 -translate-x-[10%] translate-y-[5%]" loading="lazy" />
      </div>
    </section>
  );
};

export default ChatSection;
