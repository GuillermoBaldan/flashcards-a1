import React from 'react';

const Test: React.FC = () => {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div>
        <div className="flex items-center bg-white p-4 pb-2 justify-between">
          <div className="text-[#111418] flex size-12 shrink-0 items-center" data-icon="ArrowLeft" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
            </svg>
          </div>
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Decks</h2>
        </div>
        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Select Decks</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.1) 100%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA0rTFks7UcgDVNf4niTn5OXk_sPCSyeSRrnpyb1DxvZBSTXySynbpcwV5jkC0w7e6mE1W6WqDpZ1Mx-hCiZwzWuV9w8Q_ahGKgFY772Svba4TfFY0VQwbCYCgDjK_H4wd1srDb9FKuj2XUoI9c6biihfSUdZ7Rsi_nptmmC5IiV9BOZJKAxSbygg0cym8OBN3YjsHr6v65CiQ2sZr82-6e9jDb02KHTwwRkrXd0gl4vhoepZ4XabQyfAL6omckTLRRLEW2iZq2c2w")' }}
          >
            <p className="text-white text-base font-bold leading-tight w-4/5 line-clamp-2">Deck 1</p>
          </div>
          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.1) 100%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDCXBFO7U71a-ZCu4awwvIFoCQ7HAVI0OZf_MeZZxMwtlSi3zQthXdZ47gUl_fdLyjVXpdgIL0fY0u8KVJ3ddnmBU0Oh2RwVYANCsZoNpKUCj-kF__2ArqQBYZU1b-hh9yUtE87Q0YI5YVhpYSOv_vKpWdt00N50JfpFVKjMk7xqZsjVzpHB56AoS9voOmCgB000Lmkuf5xy386wYNv1EY5UI0153XHsbv81Xhm1fQhs_oa53rKvKY_XxhwCI62qWjBP29A_W45rjM")' }}
          >
            <p className="text-white text-base font-bold leading-tight w-4/5 line-clamp-2">Deck 2</p>
          </div>
          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.1) 100%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBummMdY10-fakUCAogYyBw_c4wt5p8AE7qp0ur9_eQr-J8OMN-pG9i4KjyXOFECUbhpYy7IRUj-LhnvKPWbfj5D394jooGPY5gjVWhJc34fuh3GETujUn8VeN3jwRxYsMsKjvd-xVC2niZN9N2m1rX0wF6DkIY0mYdFJaZC6sqAlHMmmJJY_AAoN2EEa4MCTF01Ce1dkH3U3PgacsTS0iv7cfJuP530MIAjkNLtriZrNmIb1K4BEdDK0DJKHjb-eFxQ2JBVxUL1ZQ")' }}
          >
            <p className="text-white text-base font-bold leading-tight w-4/5 line-clamp-2">Deck 3</p>
          </div>
          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.1) 100%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB49mjkYXBZ8edYh6ekFyYwmw7iaSCXFU_Ppv_sYn37BaXlMwvcjcf0G9rkjw631gPwNW1cIpuyz888PxNt2Xfz0SuKeQxomxQNp3oEDO_NHgnk3U_Tq8gk3eCJRhYes5F1s__TbNYSiHzB-I-dsNr3AZ3ns-Ee7hW2xp7gqYBTTP3Ze_-QEw7Dn32CV58fQFaY8-QnctsYOZE4VaX8o9IzKBC56fdRyjjZkhCmWkZnqWiEbWnlXn4VnxirJOSo6FlvrZQknhtMKw0")' }}
          >
            <p className="text-white text-base font-bold leading-tight w-4/5 line-clamp-2">Deck 4</p>
          </div>
          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.1) 100%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB0wn88uKgeEvZlp1GkMCZVP5hO5Uda99cZZIy6RZSxRXubV5ipJ2kpa8nF64DLXGvRpI0GJT0t7w7C_z3Jq2Vx5UFDYD5mFkXEt7FBwON00DNy4dn2BU2teLUP4olj8oax1_Yk-4JPmVGr1bICiD3bHyOAecJOwxtoqaiD41i3EPRh73Ztlrfw5d38oPWJoP3MF_gP3-qkIrIzqJbgMiP3eI8")' }}
          >
            <p className="text-white text-base font-bold leading-tight w-4/5 line-clamp-2">Deck 5</p>
          </div>
          <div
            className="bg-cover bg-center flex flex-col gap-3 rounded-xl justify-end p-4 aspect-square"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%, rgba(0, 0, 0, 0.1) 100%, rgba(0, 0, 0, 0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBOm3-agQQ-a4yL3c8AhnjPjVhFO-gfB30xsbX6jK5oKkx671ki_P6b4_erPWsx1PRFGORAzn5PSqcz9e9he8pa5EKER4EK6Z-4sQ7dErFBGW_zXOJgLA6tzHK-J72jhhGZuT-dPWzMLaqLMmExhj4bflubb8THe0bltUQjit-olaLInOJphGOAfKoiDJeQhFgPDESZEXwXOJh3baezjiPfKCgna4BtU618Ekw5mKIrROZo4dULqe4WDhxH3x9pnJ0aR7lnCGmJLc")' }}
          >
            <p className="text-white text-base font-bold leading-tight w-4/5 line-clamp-2">Deck 6</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex px-4 py-3">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#166cce] text-white text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Start Test</span>
          </button>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  );
};

export default Test; 